FROM node:lts-alpine

WORKDIR /app
COPY . /app

RUN cp .env.dist .env
RUN yarn install --immutable
RUN yarn codegen

ENTRYPOINT ["yarn", "start"]
