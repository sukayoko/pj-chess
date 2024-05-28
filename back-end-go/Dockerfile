FROM golang:1.20-alpine3.18

COPY src/api /go/src/api/

WORKDIR /go/src/api/

RUN apk update \
&& apk add --no-cache git

RUN go mod tidy