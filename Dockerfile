FROM node:18-alpine

STOPSIGNAL SIGINT

WORKDIR /usr/src/gagbot

COPY package*.json ./

RUN npm install

COPY . .

CMD [ "node", "index.js" ]