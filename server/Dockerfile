FROM node:11.3.0-alpine

RUN apk update
RUN apk add mpv

COPY . /app
WORKDIR /app

RUN yarn

CMD ["yarn", "start"]
