FROM ruby:3.3.7-slim AS build

RUN apt-get update -q && \
    apt-get install -y --no-install-recommends \
    build-essential \
    default-libmysqlclient-dev \
    libyaml-dev \
    git \
    vim && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

RUN mkdir -p /srv
WORKDIR /srv

EXPOSE 3001
