FROM node:10.15.3
MAINTAINER Maxim Geerinck <geerinck.maxim@gmail.com>

# Install yarn
RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add - \
  && echo "deb http://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list  && apt-get update \
  && apt-get install -y build-essential libcairo2-dev libjpeg62-turbo-dev libpango1.0-dev libgif-dev build-essential g++ python && apt-get clean

# Set working dir and copy contents of our images to that dir  
RUN mkdir -p /usr/crypto_buy && cd /usr/crypto_buy
RUN npm install -g nodemon pm2 typescript ava node-gyp --quiet

# install dependencies
COPY *.json /usr/crypto_buy/
WORKDIR /usr/crypto_buy

# npm install will check NODE_ENV if its production if will not install dev dependencies
RUN npm install

# copy sources
COPY ./src ./src
COPY ./config ./config
COPY ./tests ./tests
COPY ./public ./public

# COMPILE
RUN npm run compile

# create env file with the port
ENV PORT 5000
EXPOSE $PORT

CMD ["pm2-docker", "process.json"]