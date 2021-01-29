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
- [Elixir](https://elixir-lang.org/)
- [Phoenix](https://github.com/phoenixframework/phoenix)
- [Absinthe](https://github.com/absinthe-graphql/absinthe)
- [Pow and PowAssent](https://github.com/danschultzer/pow)
- [Vue 3](https://github.com/vuejs/vue)
- [Vite](https://github.com/vitejs/vite)
- [URQL](https://github.com/FormidableLabs/urql)
- [Typescript](https://www.typescriptlang.org/)
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
mix archive.install hex potionx_new 0.1.0
mix potionx.new some_project_name
```

### Generating backend (soon frontend as well) scaffold code for models
Generates functions, tests and files required for basic creation and management of data models. Currently only generates backend code, but frontend file generation is coming soon.
```sh
mix potionx.gen.gql_for_model SomeContext SomeModel
```

## Deployment

### Render.com
> The following assumes you have already created an account over at Render.com
1. Create a Postgres database with a username other than "postgres"
2. Copy the "Internal Connection String"
3. Create an web service with Elixir as the environment
4. Link your Gitlab or Github repository
5. Open the "Environment" tab
6. Paste the "Internal Connection String" copied from step #2 into an environment variable called "DATABASE_URL"
7. Create an environment variable called "ELIXIR_VERSION" and set the value to "1.11.3"
8. Open a terminal in your local project and run "mix phx.gen.secret"
9. Back in the environment area, paste the result of step #8 into a variable called "SECRET_KEY_BASE"
10. Manually deploy your code by clicking the "Manual Deploy" button or make a change to your code and push

Render.com's Instructions can be found here: (https://render.com/docs/deploy-phoenix)[https://render.com/docs/deploy-phoenix]

### Digital Ocean
Coming soon...

### Google Kubernetes Engine
Coming soon...

### Other Deployment targets
AWS and Gigalixir are other popular deployment targets for Elixir we may cover if there is sufficient demand.

## Generating GraphQL Typescript Definitions
Make sure your server is started with ```mix phx.server```, open another terminal and navigate to the ```frontend/shared``` folder.

From there run:
```sh
npm install
npm run types
```

You should now have type definitions


---
### License
MIT