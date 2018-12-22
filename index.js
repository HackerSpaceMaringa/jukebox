const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const mpv = require("node-mpv");
const express = require("express");
const youtubedl = require("youtube-dl");
const uuid = require("uuid/v4");

const player = new mpv({
	audio_only: true,
});

const app = express();
const port = 3000;

const maxLength = 10;
let queue = [];
let users = [];

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.get("/playlist", (req, res) => res.status(200).json({ data: queue }));

app.post("/enqueue", (req, res) => {
  if (queue.length < maxLength) {
    const { body } = req;
console.log(body);
    if (typeof body.url === "string") {
      youtubedl.getInfo(body.url, [], (err, info) => {
        if (err) res.status(400).json({ error: "Could not grab information for video!" });
        else {
          queue.push({
            url: info.url,
            title: info.title,
            duration: info.duration,
          });
          res.status(204).end();
        }
      });
    } else {
      res.status(400).json({ error: "Video URL must be a string!" });
    }
	} else {
		res.status(418).json({ error: "Cannot put more musics on the queue!" });
	}
});

app.post("/volume", (req, res) => {
	const { body } = req;
	if (typeof body.volume === "number") {
    player.volume(body.volume);
		res.status(204).end();
	} else {
		res.status(400).json({ error: "Volume must be a number!" });
	}
});

app.post("/identify", (req, res) => {
	const { body } = req;
  if (typeof body.token === "undefined") {
    const token = uuid();
    users = users.concat({ token, timer: 5 * 60 });
    res.status(200).json({ token });
  } else if (typeof body.token === "string") {
    users = users.map(u => {
      if (u.token === body.token) {
        u.timer = 5 * 60;
      }
    });
    res.status(204).end();
	} else {
		res.status(400).json({ error: "Token must not be present or must be a string!" });
	}
});

app.get("/main.js", (req, res) => res.sendFile(path.resolve(__dirname, "public/main.min.js")));
app.get("/main.css", (req, res) => res.sendFile(path.resolve(__dirname, "public/main.min.css")));
app.get("*", (req, res) => res.sendFile(path.resolve(__dirname, "public/index.html")));

setInterval(() => {
  users = users.map(u => u.timer -= 1).filter(u => u.timer > 0);
}, 1000);

const tryPlay = () => {
  if (queue.length > 0) {
    player.load(queue[0].url);
  } else {
    setTimeout(tryPlay, 1000);
  }
};

player.on("stopped", () => {
  if (queue.length > 0) {
    queue.shift();
    if (queue.length > 0) {
      player.load(queue[0].url);
    } else {
      setTimeout(tryPlay, 1000);
    }
  } else {
    setTimeout(tryPlay, 1000);
  }
});

setTimeout(tryPlay, 1000);

app.listen(port, () => console.log(`Jukebox running on port ${port}!`));
