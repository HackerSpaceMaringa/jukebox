FROM node:11.3.0-alpine

RUN apk update
RUN apk add mpv youtube-dl python

COPY . /app
WORKDIR /app

RUN yarn

CMD ["yarn", "start"]
