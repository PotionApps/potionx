# Conventions and File Structure

## Overview
After running the Potionx project generator with `mix potionx.new some_project_name`, your project should look like the following: 

```bash
.
├─ config
│  ├─ config.exs
│  ├─ dev.exs
│  ├─ dev.secret.exs
│  ├─ prod.exs
│  ├─ runtime.exs
│  ├─ test.exs
│  └─ test.secret.exs
├─ deps
├─ frontend
│  └─ admin
│     ├─ node_modules
│     ├─ public
│     ├─ src
│     │   ├─ assets
│     │   │  └─ logo.png
│     │   ├─ components
│     │   │  ├─ AdminBody
│     │   │  ├─ AdminFooter
│     │   │  ├─ AdminHeader
│     │   │  └─ ...many more
│     │   ├─ routes
│     │   │  ├─ RouteHome
│     │   │  ├─ RouteLogin
│     │   │  ├─ RouteLoginError
│     │   │  ├─ RouteUserEdit
│     │   │  ├─ RouteUserList
│     │   │  ├─ index.ts
│     │   │  ├─ routeNames.ts
│     │   ├─ App.tsx
│     │   ├─ main.css
│     │   ├─ main.ts
│     │   ├─ useAdminNavPrimary.ts
│     │   └─ useAdminNavSecondary.ts
│     ├─ .gitignore
│     ├─ config.json
│     ├─ package.json
│     ├─ postcss.config.js
│     ├─ tailwind.config.js
│     ├─ tsconfig.json
│     └─ vite.config.ts
├─ lib
│  ├─ some_project_name
│  │   ├─ user_identities
│  │   │  ├─ user_identity.ex
│  │   │  ├─ user_identity_mock.ex
│  │   │  └─ user_identity_service.ex
│  │   ├─ users
│  │   │  ├─ user.ex
│  │   │  ├─ user_mock.ex
│  │   │  └─ user_service.ex
│  │   ├─ application.ex
│  │   ├─ release.ex
│  │   └─ repo.ex
│  ├─ some_project_name_graphql
│  │   ├─ resolvers
│  │   │  ├─ user_identity_resolver.ex
│  │   │  └─ user_resolver.ex
│  │   ├─ schemas
│  │   │  ├─ user
│  │   │  │  ├─ user_mutations.ex
│  │   │  │  ├─ user_queries.ex
│  │   │  │  └─ user_types.ex
│  │   │  └─ user_identity
│  │   │     └─ user_identity_types.ex
│  │   └─ schema.ex
│  ├─ some_project_name_web
│  ├─ some_project_name.ex
│  └─ some_project_name_web.ex
├─ node_modules
├─ priv
├─ shared
├─ test
├─ .gitignore
├─ build.sh
├─ mix.exs
├─ package.json
└─ README.md
```
