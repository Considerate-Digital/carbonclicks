#! /bin/bash
docker run --name pg-test -p 5432:5432 --env-file postgres_test.env -v ./init_test.sql:/docker-entrypoint-initdb.d/init.sql postgres:16.2-alpine3.19 &
npx playwright test -x --ignore-snapshots &
pnpm run dev > test.log &
tail -f test.log;
wait
docker stop pg-test;
docker remove pg-test;
trap "exit" INT TERM
trap "kill 0" EXIT
