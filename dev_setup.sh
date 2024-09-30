#! /bin/bash

pnpm run dev &

# start redis
# docker run -p 6379:6379 redis/redis-stack-server:latest &

# start postgres
docker run -p 5432:5432 --env-file 'dev.env' -v ./init.sql:/docker-entrypoint-initdb.d/init.sql postgres:16.2-alpine3.19 &
wait
trap "exit" INT TERM
trap "kill 0" EXIT
