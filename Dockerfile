FROM node:lts-alpine

WORKDIR /app
COPY . /app

RUN cp .env.k8s .env
RUN yarn install --immutable
RUN yarn codegen

ENTRYPOINT ["yarn", "start"]
