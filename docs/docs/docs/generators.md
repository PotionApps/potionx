# Generators

## Generating backend and frontend scaffold code for data models (Ecto Schemas)

Potionx includes a CLI tool to quickly produce boilerplate frontend and backend code for an Ecto schema.

The command accepts a context name and a model name corresponding to a Phoenix context and an Ecto Schema:
```bash
mix potionx.gen.gql_for_model <context> <model name>
```

For example:
```bash
mix phx.gen.schema SomeContext.SomeModel some_models title:string views:integer
mix potionx.gen.gql_for_model SomeContext SomeModel
```

> You will need to run `mix ecto.migrate` after running this command

The result of this command would add the following to your project:
```bash
.
├─ frontend
│  └─ admin
│     ├─ node_modules
│     ├─ public 
│     ├─ src
│     │   ├─ routes
│     │   │  ├─ <b>RouteSomeModelEdit</b>
│     │   │  ├─ <b>RouteUserList</b>
├─ lib
│  │   ├─ some_context
│  │   │  └─ <b>some_model_service.ex</b>
│  ├─ some_project_name_graphql
│  │   ├─ resolvers 
│  │   │  └─ <b>some_model_resolver.ex</b>
│  │   ├─ schemas
│  │   │  ├─ user
│  │   │  │  ├─ <b>some_model_mutations.ex</b>
│  │   │  │  ├─ <b>some_model_queries.ex</b>
│  │   │  │  └─ <b>some_model_types.ex</b>
├─ shared # shared frontend/backend code
│  ├─ src
│  │  ├─ models
│  │  │  ├─ Users
│  │  │  │  └ User
│  │  │  │    ├ <b>someModel.json </b>
│  │  │  │    ├ <b>someModel.mock.json </b>
│  │  │  │    ├ <b>someModelCollection.gql </b>
│  │  │  │    ├ <b>someModelCollection.gql.ts</b>
│  │  │  │    ├ <b>someModelDelete.gql </b>
│  │  │  │    ├ <b>someModelDelete.gql.ts </b>
│  │  │  │    ├ <b>someModelMutation.gql </b>
│  │  │  │    ├ <b>someModelMutation.gql.ts</b>
│  │  │  │    ├ <b>someModelSingle.gql </b>
│  │  │  │    └ <b>someModelSingle.gql.ts</b>
├─ test
│  ├─ some_project_graphql
│  │  ├─ mutations
│  │  │   └─ <b>some_model_mutations_test.exs</b>
│  │  └─ queries
│  │      └─ <b>some_model_queries_test.exs</b>
```

It will also modify the following files to make your model accessible and editable in the admin area
- ```frontend/admin/src/useAdminNavPrimary.ts```
- ```frontend/admin/src/routes/index.ts```
- ```frontend/admin/src/routes/routeNames.ts``` 

## Generating GraphQL Typescript Definitions for your Mutations, Queries and Types
Potionx includes a convenience command to generate types for your GraphQL schema. To do so, make sure your server is started with ```mix phx.server``` and then open another terminal and navigate to the ```shared``` folder.

From there run:
```bash
npm install
npm run types
```

You should now have up to date type definitions in your ```/shared/types.d.ts``` file.
