FROM node:12-alpine

ENV NODE_ENV=production

EXPOSE 5000

RUN apk add --no-cache tini

WORKDIR /node

COPY package.json package-lock*.json ./

RUN npm install && npm cache clean --force

ENV PATH /node/node_modules/.bin:$PATH

WORKDIR /node/app

COPY . .

ENTRYPOINT [ "/sbin/tini", "--" ]

CMD ["node", "server.js"]
