# Getting Started

## Prerequisites
- [Node](https://nodejs.org/en/) version 12 or above
- [Elixir](https://elixir-lang.org/install.html) version 1.11 or above
- [PostgresQL](https://www.postgresql.org/) version 9.6 or above
- Familiarity with [Elixir](https://elixir-lang.org/) and [Phoenix](https://www.phoenixframework.org/)
- Familiarity with [Vue](https://vuejs.org/) and JSX


## Generating a project
```bash
mix archive.install hex potionx_new
mix potionx.new some_project_name
```
> If this is your first time using Elixir, you probably don't have [Hex](https://hexdocs.pm/phoenix/installation.html) installed. It should offer to install it for you, or you can run `mix local.hex`.

> Phoenix may also ask to install [Rebar](https://hexdocs.pm/phoenix/up_and_running.html). Go ahead with the installation as Rebar is used to build Erlang packages or you can manually run `mix local.rebar`

While running `mix potionx.new some_project_name`, you will be asked to provide some information:
- What is the user for your local Postgres database? (Defaults to Postgres)
- What is the password to your local Postgres database?
- What email should the default user have? (If you want to login using a social platform, enter the email here. You can change this later on in your database)

This will create a project, install dependencies and run migrations based on the [conventions and code structure here](https://docs.potionapps.com/conventions/overview.html#file-structure).

To start your app's backend, run the following in your new directory:
```bash
mix phx.server
```

To start your app's frontend, run the following in your new directory:
```
cd frontend/admin
npm run dev
```