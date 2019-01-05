const cookieParser = require("cookie-parser");
const logger = require("morgan");
const mpv = require("node-mpv");
const express = require("express");
const youtubedl = require("youtube-dl");
const uuid = require("uuid/v4");
const cors = require("cors");

const player = new mpv({
  audio_only: true
});

const app = express();
const port = process.env.PORT || 3000;

let queue = [];
let users = [];

const maxLength = n => 7 + n * 3;
const shouldSkip = (n, u) => n / u > 0.6667;

let seqId = 0;

app.use(
  cors({
    origin: "http://localhost:8080",
    methods: ["GET", "POST"]
  })
);
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

const isIndentified = (req, res, next) => {
  const { body } = req;
  if (
    typeof body.token !== "string" ||
    !users.find(u => u.token === body.token)
  ) {
    res.status(401).json({
      error: "Você precisa ser um usuário identificado para enviar comandos!"
    });
  } else {
    next();
  }
};

app.get("/playlist", (req, res) => {
  const { body } = req;
  res.status(200).json({
    playlist: queue.map(e => ({ ...e, votes: e.votes.includes(body.token) }))
  });
});

app.post("/enqueue", isIndentified, (req, res) => {
  const { body } = req;
  if (queue.length < maxLength(users.length)) {
    if (typeof body.url === "string") {
      youtubedl.exec(
        body.url,
        ["--get-id", "--get-title", "--get-duration"],
        {},
        (err, output) => {
          if (err) {
            console.log(err);
            res.status(400).json({
              error: "Não foi possível obter as informações do vídeo!"
            });
          } else {
            const titles = output.filter((e, i) => i % 3 === 0);
            const ids = output.filter((e, i) => i % 3 === 1);
            const durations = output.filter((e, i) => i % 3 === 2);
            const parseds = ids
              .map((e, i) => ({
                id: id++,
                url: e,
                title: titles[i],
                duration: durations[i],
                votes: []
              }))
              .slice(0, maxLength(users.length) - queue.length);
            parseds.forEach(e => queue.push(e));
            res.json({ items: parseds });
          }
        }
      );
    } else {
      res.status(400).json({ error: "A URL do video deve ser uma string!" });
    }
  } else {
    res.status(418).json({
      error: "Não é possível colocar mais músicas, a fila está cheia!"
    });
  }
});

app.get("/volume", (req, res) => {
  player.getProperty("volume").then(volume => res.json({ volume }));
});

app.post("/volume", isIndentified, (req, res) => {
  const { body } = req;
  if (typeof body.volume === "number") {
    player.volume(body.volume);
    res.status(204).end();
  } else {
    res.status(400).json({ error: "O volume deve ser um número!" });
  }
});

app.post("/skip", (req, res) => {
  const { body } = req;
  if (typeof body.id === "number") {
    queue = queue
      .map(
        e =>
          body.id === e.id
            ? { ...e }
            : { ...e, votes: e.votes.concat([body.token]) }
      )
      .filter(e => shouldSkip(e.votes.length, users.length));
  } else {
    res.status(400).json({ error: "O id do voto deve ser um número!" });
  }
});

app.get("/identify", (req, red) => {
  res.json({ users: users.length });
});

app.post("/identify", (req, res) => {
  const { body } = req;
  if (typeof body.token === "undefined") {
    const token = uuid();
    users = users.concat({ token, timer: 1 * 60 });
    res.status(200).json({ token });
  } else if (typeof body.token === "string") {
    if (!users.find(u => u.token === body.token)) {
      res.status(401).json({ error: "O token é inválido!" });
    } else {
      users = users.map(u => {
        if (u.token === body.token) u.timer = 1 * 60;
        return u;
      });
      res.status(200).json({ token: body.token });
    }
  } else {
    res.status(400).json({
      error:
        "O token deve ser uma string ou deve ser vazio para receber um novo!"
    });
  }
});

setInterval(() => {
  users = users
    .map(u => {
      u.timer -= 1;
      return u;
    })
    .filter(u => u.timer > 0);
}, 1000);

const tryPlay = () => {
  if (queue.length > 0) {
    player.load(`ytdl://${queue[0].url}`);
  } else {
    setTimeout(tryPlay, 1000);
  }
};

player.on("stopped", () => {
  if (queue.length > 0) {
    queue.shift();
    tryPlay();
  } else {
    setTimeout(tryPlay, 1000);
  }
});

setTimeout(tryPlay, 1000);

app.listen(port, () => console.log(`A Jukebox está rodando na porta ${port}!`));
