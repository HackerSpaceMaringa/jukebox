FROM node:11.3.0-alpine

RUN apk update
RUN apk add mpv python

ADD https://yt-dl.org/downloads/latest/youtube-dl /usr/local/bin/youtube-dl
RUN chmod a+rx /usr/local/bin/youtube-dl

WORKDIR /app

COPY package.json .
RUN yarn

COPY . /app

CMD ["yarn", "start"]
