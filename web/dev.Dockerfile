FROM node:23-slim

WORKDIR /app

COPY package.json .

RUN npm install

EXPOSE 3000

ENTRYPOINT [ "npm", "run", "start" ]