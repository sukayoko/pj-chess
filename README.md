# pj-chess
Project chess

git から clone してから
docker compose up -d で行けると思う
※npm install しないとダメかも?

# postgresへの入り方
docker container exec -it uma-postgres bash
psql -U root -d umadb

# goapi の起動方法
src/api に go.mod を作成し以下のような内容を記載する。

module alforest.net/chess
go 1.20
