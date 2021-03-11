# Getting Started

## Generating a project

```bash
npx @potionapps/templates project
```

You will be prompted with the following questions:
- What directory name should your app have? (snake_case)
- What email to you want to log in with?
- What is your local PostgreSQL username?
- What is your local PostgreSQL password?
- Install dependencies?
- Run database preparation?

> (An email is required to log in. In production the email needs to be the email you use to log in to one of the [social logins](/docs/social). In development, any email may be used

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

You can now proceed to the login page of your project at `localhost:4000`