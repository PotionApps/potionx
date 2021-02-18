# Getting Started

## Prerequisites
- [Node version 12 or above](https://nodejs.org/en/)
- [Elixir version 1.11 or above](https://elixir-lang.org/install.html)
- Familiarity with [Elixir](https://elixir-lang.org/) and [Phoenix](https://www.phoenixframework.org/)
- Familiarity with [Vue](https://vuejs.org/) and JSX


## Generating a project
```bash
mix archive.install hex potionx_new
mix potionx.new some_project_name
```
This will create a project, install dependencies and run migrations based on the [conventions and code structure here](https://docs.potionapps.com/conventions/overview.html#file-structure).

In order to log in, update `config/dev.secret.exs` with the social platform(s) of your choice.
- [Apple instructions](https://developer.apple.com/documentation/authenticationservices)
- [Github instructions](https://docs.github.com/en/developers/apps/authorizing-oauth-apps)
- [Google instructions](https://developers.google.com/identity/protocols/oauth2)
- [Microsoft instructions](https://docs.microsoft.com/en-us/azure/active-directory/develop/quickstart-register-app)
- [Twitter instructions](https://developer.twitter.com/en/docs/authentication/guides)

To start your app's backend, run the following in your new directory:
```bash
mix phx.server
```

To start your app's frontend, run the following in your new directory:
```
cd frontend/admin
npm run dev
```