# Handy Docker commands

## Build image
```sh
docker build -t nightingale-typescript-example .
```

## Start container
```sh
docker run -it nightingale-typescript-example:latest
```

## Kill container
```sh
docker kill $(docker ps -a -q  --filter ancestor=nightingale-typescript-example)
```

## Inspect container health
```sh
docker inspect --format='{{json .State.Health}}' $(docker ps -q  --filter ancestor=nightingale-typescript-example) | jq
```
