# Potionx

### A Toolkit for rapidly building and deploying full-stack applications with Elixir and Vue

Potionx is a set of generators and modules that speeds up the process of setting up and deploying a full-stack application that uses Elixir with GraphQL for the server-side component and Vue for the frontend component.

> **Warning:** Still in early stages of development. Not suitable for production use. 

## Features
- Uses [opinionated defaults for naming and file structure](/conventions/overview).
- Uses [Phoenix](https://www.phoenixframework.org/) as the base Elixir framework with some opinionated defaults.
- GraphQL layer that uses [Absinthe](http://absinthe-graphql.org/).
- Social login with Apple, Google, Github, Twitter enabled using [Pow and PowAssent](https://powauth.com/)
- [Pow and PowAssent](https://powauth.com/) for authentication/authorization
- Frontend components using [Vue 3](https://vuejs.org/) with JSX, Typescript and [TailwindCSS](https://tailwindcss.com/).
- Fast frontend development with [Vite](https://vitejs.dev/)
- [@potionapps/forms](/guide/forms), Vue 3 form helpers
- [@potionapps/ui](/generators/ui), a collection of pre-made UI components that can be easily copied over to your project.
- *Coming soon*: Recipes for deployment with [Pulumi](https://www.pulumi.com/) and recipe for deployment to [Render.com](https://render.com/)

## Technologies
- [Elixir](https://elixir-lang.org/)
- [Phoenix](https://www.phoenixframework.org/)
- [Absinthe](http://absinthe-graphql.org/)
- [PostgreSQL](https://www.postgresql.org/)
- [Pow and PowAssent](https://powauth.com/)
- [Redis](https://redis.io/)
- [Vue 3](https://vuejs.org/)
- [Vite](https://vitejs.dev/)
- [URQL](https://formidable.com/open-source/urql/)
- [Typescript](https://www.typescriptlang.org/)
- [TailwindCSS](https://tailwindcss.com/) / [Windicss](https://windicss.netlify.app/)