FROM node:11.3.0-alpine

RUN apk update
RUN apk add mpv python

ADD https://yt-dl.org/downloads/latest/youtube-dl /usr/local/bin/youtube-dl
RUN chmod a+rx /usr/local/bin/youtube-dl

COPY . /app
WORKDIR /app

RUN yarn

CMD ["yarn", "start"]
