# image built on official nodejs v6
FROM node:latest
MAINTAINER Maxim Geerinck <geerinck.maxim@gmail.com>

# Install yarn, apt-get update not necessary as its already done in previous image
# RUN apt-get install graphicsmagick -y && apt-get clean

RUN npm install -g concurrently nodemon typescript --silent
RUN mkdir -p /usr/crypto_buy/frontend/client && mkdir -p /usr/crypto_buy/frontend/service

# CLIENT
WORKDIR /usr/crypto_buy/frontend/client
COPY client/*.json ./
RUN npm install --silent

# SERVICE
WORKDIR /usr/crypto_buy/frontend/service
COPY service/*.json ./
RUN npm install --silent

# Install sources
COPY client/src /usr/crypto_buy/frontend/client/src
COPY client/public /usr/crypto_buy/frontend/client/public
COPY client/scripts /usr/crypto_buy/frontend/client/scripts
COPY client/config /usr/crypto_buy/frontend/client/config
COPY client/.babelrc client/.eslintignore client/.eslintrc /usr/crypto_buy/frontend/client/
COPY service/src /usr/crypto_buy/frontend/service/src
COPY service/tsconfig.json service/tslint.json /usr/crypto_buy/frontend/service/

# # create env file with the port
ENV PORT 3000
EXPOSE $PORT

CMD concurrently -p "[{name}]" -n "SERVICE,CLIENT" -c "bgBlue.bold,bgMagent.bold" "npm run dev --loglevel=silent" "cd ../client && npm run dev-docker"