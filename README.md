# Cryptotrackr

## Setup

```
docker-compose build
docker-compose up -d
```

## Adding a new notification

```
docker exec cryptobuy_app_1 node build/cli/AddNotification "yourmessage"
```

## Updating coin name in array

ex. Change all raiblocks to nano

```
db.getCollection('users').updateMany(
    {"portfolio.coin_id": "raiblocks"},
    {$set: {
        "portfolio.$.coin_id": "nano"
    }}
)
```

ex. change all walton to waltonchain

```
db.getCollection('users').updateMany(
    {"portfolio.coin_id": "walton"},
    {$set: {
        "portfolio.$.coin_id": "waltonchain"
    }}
)
```
