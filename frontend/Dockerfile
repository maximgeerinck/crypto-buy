# image built on official nodejs v6
FROM node:latest
MAINTAINER Maxim Geerinck <geerinck.maxim@gmail.com>

# Install yarn, apt-get update not necessary as its already done in previous image
RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add - \
  && echo "deb http://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list && apt-get update \
  && apt-get install yarn graphicsmagick -y && apt-get clean

RUN mkdir -p /usr/crypto_buy/frontend/src

#Install dependencies
COPY package.json /usr/crypto_buy/frontend
WORKDIR /usr/crypto_buy/frontend
RUN npm install --loglevel=silent

# Install sources
COPY src /usr/crypto_buy/frontend/src
COPY public /usr/crypto_buy/frontend/public

# create env file with the port
ENV PORT 3000
EXPOSE $PORT

CMD ["npm", "start"]