FROM mhart/alpine-node:5
MAINTAINER stockulus

RUN npm install babel-cli@6.10.1 -g --save
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json /usr/src/app/
RUN npm install --production

COPY . /usr/src/app

ENV PORT=3000

EXPOSE 3000

ENTRYPOINT ["npm", "run", "dev"]
