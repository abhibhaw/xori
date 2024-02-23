FROM node:20-alpine3.19

ENV NODE_ENV=production

WORKDIR /app

COPY package.json /app/package.json

COPY yarn.lock /app/yarn.lock

RUN npm install -g --force yarn

RUN yarn install --production --force --silent

COPY . /app/

CMD ["yarn", "start"]
