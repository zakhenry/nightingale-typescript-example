# nightingale-typescript-example

This repo serves as both a demonstrator of a Typescript gRPC service utilising the
binary [nightingale](https://github.com/zakhenry/nightingale) docker healthchecker,
and as independent integration tests for Nightingale itself.

## Features
* Typescript server implementing [gRPC health checking protocol](https://github.com/grpc/grpc/blob/master/doc/health-checking.md)
  * Server also implements another gRPC service (`ExampleService`) with only feature being able to set health status
* Typescript gRPC client that connects to `ExampleService` in order to set the server status
* Dockerfile demonstrating usage of `nightingale` for health checking

### Still to come
* Integration tests to verify health checking
  * Will likely use https://github.com/AgustinCB/docker-api to orchestrate containers

