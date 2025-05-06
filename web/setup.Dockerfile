FROM node:23-slim

WORKDIR /app

ENTRYPOINT [ "tail", "-f", "/dev/null" ]