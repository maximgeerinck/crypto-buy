## Installation Docker

This creates a standard droplet (512mb, 5$ droplet)

```
docker-machine create --driver digitalocean --engine-install-url=https://web.archive.org/web/20170623081500/https://get.docker.com --digitalocean-access-token=<api key> docker-cryptotrackr
```

* view all flags: `docker-machine create --driver digitalocean -h`
* view: `docker-machine inspect docker-cryptotrackr`
* output connection configuration: `docker-machine config docker-cryptotrackr`
* execute command: `docker-machine ssh docker-cryptotrackr apt-get upgrade`

* activate: `eval $(docker-machine env docker-cryptotrackr)` or `docker-machine use docker-cryptotrackr`
* exit an active host: `docker-machine use -u`

## Adding swap space

```
fallocate -l 2G /swapfile
chmod 600 /swapfile
mkswap /swapfile
swapon /swapfile
swapon --show
cp /etc/fstab /etc/fstab.bak
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
echo 'vm.swappiness=10' >> /etc/sysctl.conf
echo 'vm.vfs_cache_pressure=50' >> /etc/sysctl.conf
```

## Backup mongo db

```
docker run \
    --rm \
    --link mongo:mongo \
    -v /root:/backup mongo bash \
    -c 'mongodump --out /backup --host $MONGO_PORT_27017_TCP_ADDR'
```

and copy to machine using

```
docker-machine scp -r dev:/root/test .
```
