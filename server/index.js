const cookieParser = require('cookie-parser');
const logger = require('morgan');
const Mpv = require('node-mpv');
const express = require('express');
const youtubedl = require('youtube-dl');
const uuid = require('uuid/v4');
const cors = require('cors');

let queue = [];

const player = new Mpv({
  audio_only: true,
});

const tryPlay = () => {
  if (queue.length) player.load(`ytdl://${queue[0].url}`);
};

const app = express();
const port = process.env.PORT || 3000;

const users = new Map();

const maxLength = n => 7 + n * 3;
const shouldSkip = (n, u) => n / u > 0.6667;
const userTimeout = 60; // 60 Seconds

app.use(
  cors({
    origin: 'http://localhost:8080',
    methods: ['GET', 'POST'],
  }),
);
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

const identify = (req, res, next) => {
  const { headers } = req;

  req.token = headers['x-real-ip'];
  users.set(req.token, userTimeout);

  next();
};

app.use(identify);

app.get('/playlist', (req, res) => {
  res.status(200).json({
    playlist: queue.map(e => ({ ...e, votes: e.votes.has(req.token) })),
  });
});

app.post('/enqueue', (req, res) => {
  const { body } = req;
  if (queue.length < maxLength(users.size)) {
    if (typeof body.url === 'string') {
      youtubedl.exec(
        body.url,
        ['--get-id', '--get-title', '--get-duration'],
        {},
        (err, output) => {
          if (err) {
            res.status(400).json({
              error: 'Não foi possível obter as informações do vídeo!',
            });
          } else {
            const titles = output.filter((e, i) => i % 3 === 0);
            const ids = output.filter((e, i) => i % 3 === 1);
            const durations = output.filter((e, i) => i % 3 === 2);
            const parseds = ids
              .map((e, i) => ({
                id: uuid(),
                url: e,
                title: titles[i],
                duration: durations[i],
                votes: new Set(),
              }))
              .slice(0, maxLength(users.size) - queue.length);

            // Keep the size of queue before add new songs
            const prevQueueState = queue.length;
            parseds.forEach(e => queue.push(e));

            // If the size before enqueue was 0 play new song
            if (!prevQueueState) tryPlay();

            res.json({ items: parseds });
          }
        },
      );
    } else {
      res.status(400).json({ error: 'A URL do video deve ser uma string!' });
    }
  } else {
    res.status(418).json({
      error: 'Não é possível colocar mais músicas, a fila está cheia!',
    });
  }
});

app.get('/volume', (req, res) => {
  player.getProperty('volume').then(volume => res.json({ volume }));
});

app.post('/volume', (req, res) => {
  const { body } = req;
  if (typeof body.volume === 'number') {
    player.volume(body.volume);
    res.status(204).end();
  } else {
    res.status(400).json({ error: 'O volume deve ser um número!' });
  }
});

app.post('/skip', (req, res) => {
  const { body } = req;
  if (typeof body.id === 'string') {
    const itemVoted = queue.find(e => body.id === e.id);

    if (itemVoted) {
      itemVoted.votes.add(req.token);
      queue = queue.filter(e => !shouldSkip(e.votes.size, users.size));
      res.status(204).end();
    } else {
      res.status(404).json({ error: 'Id não encontrado' });
    }
  } else {
    res.status(400).json({ error: 'O id do voto deve ser uma string!' });
  }
});

app.get('/identify', (req, res) => {
  res.json({ users: users.size });
});

setInterval(() => {
  users.forEach((time, token) => {
    const newTime = time - 1;
    if (newTime) users.set(token, newTime);
    else users.delete(token);
  });
}, 1000);

player.on('stopped', () => queue.shift() && tryPlay());

app.listen(port, () => console.log(`A Jukebox está rodando na porta ${port}!`));
