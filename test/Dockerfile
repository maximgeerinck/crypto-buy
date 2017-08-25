# image built on official nodejs v6
FROM node:8.4-alpine
MAINTAINER Maxim Geerinck <geerinck.maxim@gmail.com>

# Install yarn, apt-get update not necessary as its already done in previous image
# RUN apt-get install graphicsmagick -y && apt-get clean

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
COPY service/src /usr/crypto_buy/frontend/service/src

# # create env file with the port
ENV PORT 3000
EXPOSE $PORT

CMD ["npm", "run", "dev"]