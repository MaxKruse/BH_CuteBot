FROM node:current-alpine3.10

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

CMD [ "node" , "main.js" ]