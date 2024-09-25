#! /bin/bash

git fetch
git merge
docker compose build
docker compose up -d
