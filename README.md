# Potionx ⚗️

## A Toolkit for rapidly building and deploying full-stack applications with Elixir and Vue
Potionx is a set of generators and functions that speeds up the process of setting up and deploying a full-stack application that uses Elixir with GraphQL for the server-side component and Vue for the frontend component. 

> **Warning:** Still in early stages of development. Not suitable for production use. 

### Features
- Uses opinionated defaults for naming and file structure.
- Uses [Phoenix](https://github.com/phoenixframework/phoenix) as the base Elixir framework with some opinionated defaults.
- GraphQL layer that uses [Absinthe](https://github.com/absinthe-graphql/absinthe).
- Social login with Apple, Google, Github, Twitter enabled using [Pow and PowAssent](https://github.com/danschultzer/pow)
- Uses [Pow and PowAssent](https://github.com/danschultzer/pow) for authentication/authorization
- Recipes for deployment to [Gigalixir](https://www.gigalixir.com/), [Render.com](https://render.com/), [Digital Ocean Kubernetes Engine](https://www.digitalocean.com/products/kubernetes/), [Google Kubernetes Engine](https://cloud.google.com/kubernetes-engine)
- Frontend components using [Vue 3](https://github.com/vuejs/vue) with JSX, Typescript and [TailwindCSS](https://tailwindcss.com/).
- Fast frontend development with [Vite](https://github.com/vitejs/vite)

### Technologies
- [Phoenix](https://github.com/phoenixframework/phoenix)
- [Absinthe](https://github.com/absinthe-graphql/absinthe)
- [Pow and PowAssent](https://github.com/danschultzer/pow)
- [Vue 3](https://github.com/vuejs/vue)
- [Vite](https://github.com/vitejs/vite)
- [URQL](https://github.com/FormidableLabs/urql)
- [TailwindCSS](https://tailwindcss.com/)

### Deployment Targets
- [Render.com](https://render.com/)
- [Digital Ocean Kubernetes Engine](https://www.digitalocean.com/products/kubernetes/)
- [Google Kubernetes Engine](https://cloud.google.com/kubernetes-engine)

## Getting Started

### Prerequisites

- [Node version 12 or above](https://nodejs.org/en/)
- [Elixir version 1.11 or above](https://elixir-lang.org/install.html)
- Familiarity with Elixir and Phoenix
- Familiarity with Vue


### Generating a project

```sh
mix archive.install hex potionx_new 0.0.1
mix potionx.new some_project_name
```

### Generating backend (soon frontend as well) scaffold code for models
Generates functions, tests and files required for basic creation and management of data models. Currently only generates backend code, but frontend file generation is coming soon.
```sh
mix potionx.gen.gql_for_model SomeContext SomeModel
```

---
### License
MIT