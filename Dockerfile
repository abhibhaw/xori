FROM node:20-alpine3.19

ENV NODE_ENV=production

WORKDIR /app

COPY package.json /app/package.json

COPY pnpm-lock.yaml /app/pnpm-lock.yaml

RUN npm install -g --force pnpm

RUN pnpm install --production --force --silent

COPY . /app/

CMD ["pnpm", "start"]
