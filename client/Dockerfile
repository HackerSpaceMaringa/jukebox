FROM node:11.3.0-alpine as builder

COPY . /app
WORKDIR /app

RUN npm rebuild node-sass && yarn && yarn build --mode debug

FROM nginx

COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=builder /app/dist/ /var/www/html
