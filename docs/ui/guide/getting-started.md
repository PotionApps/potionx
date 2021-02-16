# Getting Started

## Prerequisites

- [Node version 12 or above](https://nodejs.org/en/)
- [Elixir version 1.11 or above](https://elixir-lang.org/install.html)
- Familiarity with Elixir and Phoenix
- Familiarity with Vue


## Generating a project

```sh
mix archive.install hex potionx_new 0.0.13
mix potionx.new some_project_name
```

## Generating backend and frontend scaffold code for models
Generates functions, tests and files required for basic creation and management of data models.
```sh
mix potionx.gen.gql_for_model SomeContext SomeModel
```
