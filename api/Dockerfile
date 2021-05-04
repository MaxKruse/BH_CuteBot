FROM node:16-alpine

WORKDIR /app

RUN npm install typescript -g

COPY package*.json ./

RUN npm install

COPY . .

RUN tsc

CMD [ "node" , "dist/main.js" ]