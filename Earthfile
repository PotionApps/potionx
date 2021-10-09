all:
    BUILD +all-test
    BUILD +all-integration-test
    BUILD +test-forms
    BUILD +test-templates

all-frontend:
    BUILD +test-forms
    BUILD +test-templates

all-test:
    BUILD --build-arg ELIXIR=1.12.2 --build-arg OTP=24.0.3 -P +test

test:
    FROM +setup-test
    RUN apk add --no-progress --update docker docker-compose
    RUN apk add postgresql-client inotify-tools
    RUN MIX_ENV=test mix deps.compile
    COPY --dir config lib priv test ./
    COPY ./docker-compose.yml ./docker-compose.yml
    ENV DATABASE_URL="ecto://postgres:postgres@localhost/potionx_test"

    WITH DOCKER
        # Start docker compose
        # In parallel start compiling tests
        # Check for DB to be up x 3
        # Run the database tests
        RUN docker-compose up -d & \
            while ! pg_isready --host=localhost --port=5432 --quiet; do sleep 1; done; \
            mix test && \
            MIX_ENV=test mix clean && \
            REDIS_URL="redis://localhost:6379/" mix test
    END



all-integration-test:
    BUILD --build-arg ELIXIR=1.12.2 --build-arg OTP=24.0.3 +integration-test

integration-test:
    FROM +setup-test

    RUN apk add --no-progress --update docker docker-compose

    # Install tooling needed to check if the DBs are actually up when performing integration tests
    RUN apk add postgresql-client inotify-tools

    # Integration test deps
    COPY ./docker-compose.yml ./integration_test/docker-compose.yml
    RUN mix local.hex --force
    RUN mix local.rebar --force
    RUN mkdir -p packages/templates
    COPY packages/templates/package* packages/templates
    WORKDIR packages/templates
    RUN npm install
    WORKDIR /src
    COPY --dir config packages lib test priv /src
    ENV DATABASE_URL="ecto://postgres:postgres@localhost/potionx_test"
    RUN MIX_ENV="test" mix compile
    WORKDIR /src/integration_test

    # Compile phoenix
    # COPY --dir config` installer lib test priv /src
    # Compiling here improves caching, but slows down GHA speed
    # Removing until this feature exists https://github.com/earthly/earthly/issues/574
    # RUN MIX_ENV=test mix deps.compile
    # RUN npm install '/src/packages/templates'

    WITH DOCKER
        # Start docker compose
        # In parallel start compiling tests
        # Check for DB to be up x 3
        # Run the database tests
        RUN docker-compose up -d & \
            while ! pg_isready --host=localhost --port=5432 --quiet; do sleep 1; done; \
            node ../packages/templates/cli/cli.mjs project --appName=alpha --localDbPassword=postgres --localDbUser=postgres \
            --email=vince@potionapps.com --installDeps --runMigrations --potionxDep='path: "../.."' && \
            cd alpha && \
            mix phx.gen.schema Files.File files name:string data:map date:utc_datetime test:uuid is_deleted:boolean && \
            mix potionx.gen.gql_for_model Files File --no-frontend && \
            REDIS_URL="redis://localhost:6379/" mix test && \
            cd ./frontend/admin && \
            npm run build
    END

test-forms:
    FROM node:14.16.0-alpine3.12
    WORKDIR /src
    RUN mkdir -p packages/forms
    # Copy package.json + lockfile separatelly to improve caching (JS changes don't trigger `npm install` anymore)
    COPY packages/forms/package* packages/forms
    WORKDIR packages/forms
    RUN npm install
    COPY packages/forms/ .
    RUN npm test

test-templates:
    FROM node:14.16.0-alpine3.12
    WORKDIR /src
    RUN mkdir -p packages/templates
    # Copy package.json + lockfile separatelly to improve caching (JS changes don't trigger `npm install` anymore)
    COPY packages/templates/package* packages/templates
    WORKDIR packages/templates
    RUN npm install
    COPY packages/templates/ .
    RUN npm test

test-ui:
    FROM node:14.16.0-alpine3.12
    WORKDIR /src
    RUN mkdir -p packages/ui
    # Copy package.json + lockfile separatelly to improve caching (JS changes don't trigger `npm install` anymore)
    COPY packages/ui/package* packages/ui
    WORKDIR packages/ui
    RUN npm install
    COPY packages/ui/ .
    RUN npm test

setup-base:
   ARG ELIXIR=1.12.2
   ARG OTP=24.0.3
   FROM hexpm/elixir:$ELIXIR-erlang-$OTP-alpine-3.13.3
   RUN apk add --no-progress --update bash git build-base npm nodejs
   ENV ELIXIR_ASSERT_TIMEOUT=10000
   WORKDIR /src

setup-test:
  FROM +setup-base
  COPY mix.exs .
  COPY mix.lock .
  COPY .formatter.exs .
  COPY package.json .
  RUN mix local.rebar --force
  RUN mix local.hex --force
  RUN mix deps.get