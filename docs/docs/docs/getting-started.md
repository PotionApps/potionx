# Getting Started

## Potionx_new installer

First, you will need the Potionx installer

```bash
mix archive.install hex potionx_new
```
> If you have installed ```hex``` before, you'll need to install it with: `mix local.hex`.

## Generating a project

Once the installer is installed, you can generate a Potionx project by running the following command

```bash
mix potionx.new some_project_name
```

You will be prompted with the following questions:
- What is the user for your local Postgres database? (Defaults to Postgres)
- What is the password to your local Postgres database?
- What email should the default user have? 
> (An email is required to log in. In production the email needs to be the email you use to log in to one of the [social logins](/docs/social.html). In development, any email may be used

This will create a project, install dependencies and run migrations based on the [conventions and code structure here](https://docs.potionapps.com/conventions/overview.html#file-structure).

To start your app's backend, run the following command in your new directory:
```bash
mix phx.server
```

To start your app's frontend, run the following commands in your new directory:
```
cd frontend/admin
npm run dev
```