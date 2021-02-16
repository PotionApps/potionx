# Conventions and File Structure

## Overview
Here's an overview of what a Potionx project looks like. It's what a project directory contains after running the Potionx project generator with `mix potionx.new some_project_name`.

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
│  │   ├─ channels
│  │       └─ user_socket.ex
│  │   ├─ controllers
│  │   │  ├─ app_controller.ex
│  │   │  ├─ auth_controller.ex
│  │   │  ├─ authorization_controller.ex
│  │   │  └─ page_controller.ex
│  │   ├─ templates
│  │   │  ├─ app
│  │   │  │  └─ index.html.eex
│  │   │  ├─ authorization
│  │   │  │  └─ refresh.html.eex
│  │   │  ├─ layout
│  │   │  │  └─ app.html.eex
│  │   │  └─ page
│  │   │     └─ index.html.eex
│  │   ├─ views
│  │   │  ├─ app_view.ex
│  │   │  ├─ authorization_view.ex
│  │   │  ├─ error_helpers.ex
│  │   │  ├─ error_view.ex
│  │   │  ├─ layout_view.ex
│  │   │  └─ page_view.ex
│  │   ├─ endpoint.ex
│  │   ├─ gettext.ex
│  │   ├─ router.ex
│  │   └─ telemetry.ex
│  ├─ some_project_name.ex
│  └─ some_project_name_web.ex
├─ node_modules
├─ priv
│  ├─ gettext
│  │  ├─ en
│  │  │  └─ errors.po
│  │  └─ errors.pot
│  ├─ repo
│  │  ├─ migrations
│  │  │  ├─ DATE_create_users.exs
│  │  │  └─ DATE_create_user_identities.exs
│  │  ├─ potionx_seed.exs
│  │  └─ seed.exs
├─ shared
│  ├─ src
│  │  ├─ models
│  │  │  ├─ Users
│  │  │  │  └ User
│  │  │  │    ├ user.json
│  │  │  │    ├ user.mock.json
│  │  │  │    ├ userCollection.gql
│  │  │  │    ├ userCollection.gql.ts
│  │  │  │    ├ userDelete.gql
│  │  │  │    ├ userDelete.gql.ts
│  │  │  │    ├ userMutation.gql
│  │  │  │    ├ userMutation.gql.ts
│  │  │  │    ├ userSingle.gql
│  │  │  │    └ userSingle.gql.ts
│  │  │  └─ UserIdentities
│  │  │      └ User
│  │  │        ├ userIdentity.json
│  │  │        └ userIdentity..mock.json
│  │  ├─ gql.ts
│  │  ├─ signIn.ts
│  │  ├─ signOut.ts
│  │  └─ types.d.ts
│  ├─ .gitignore
│  ├─ codegen.yml
│  ├─ config.json
│  └─ package.json
├─ test
│  ├─ some_project_graphql
│  │  ├─ mutations
│  │  │   └─ user_mutations_test.exs
│  │  └─ queries
│  │      └─ user_queries_test.exs
│  ├─ some_project_web
│  │  ├─ channels (empty)
│  │  ├─ controllers (empty)
│  │  └─ views
│  │      ├─ error_view_test.exs
│  │      ├─ layout_view_test.exs
│  │      └─ page_view_test.exs
│  ├─ support
│  │  ├─ channel_case.ex
│  │  ├─ conn_case.ex
│  │  └─ data_case.ex
│  └─ test_helper.texs
├─ .gitignore
├─ build.sh
├─ mix.exs
├─ package.json
└─ README.md
```