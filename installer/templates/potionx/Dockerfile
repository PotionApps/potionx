FROM elixir:1.11.3-alpine AS build

# install build dependencies
RUN apk add --no-cache build-base npm git python

# prepare build dir
WORKDIR /app

# install hex + rebar
RUN mix local.hex --force && \
    mix local.rebar --force

# set build ENV
ENV MIX_ENV=prod

# install mix dependencies
COPY mix.exs mix.lock ./
COPY config config

RUN mix do deps.get, deps.compile

# build assets
COPY frontend/admin/package.json frontent/admin/package-lock.json ./frontend/admin/
RUN npm --prefix ./frontend/admin ci --progress=false --no-audit --loglevel=error

COPY priv priv
COPY frontend/admin frontend/admin
RUN npm run --prefix ./frontend/admin build

# compile and build release
COPY lib lib
# uncomment COPY if rel/ exists
# COPY rel rel
RUN mix do compile, release

# prepare release image
FROM alpine:3.13 AS app
RUN apk add --no-cache openssl ncurses-libs

WORKDIR /app

RUN chown nobody:nobody /app

USER nobody:nobody

COPY --from=build --chown=nobody:nobody /app/_build/prod/rel/<%= @app_name %> ./

ENV HOME=/app

CMD ["bin/<%= @app_name %>", "start"]