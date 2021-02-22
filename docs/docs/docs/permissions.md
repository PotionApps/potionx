# Permissions

## API/GraphQL Permissions

Permissions for mutations and queries are handled at the ```GraphQL layer``` of your app.
```bash
.
├─ config
├─ deps 
├─ frontend
├─ lib
│  ├─ some_project_name
│  ├─ some_project_name_graphql # The GraphQL layer
│  │   ├─ schemas
│  │   │  ├─ user
│  │   │  │  ├─ user_mutations.ex # User mutation permissions would go here
│  │   │  │  ├─ user_queries.ex # User query permissions would go here
│  │   │  │  └─ user_types.ex
│  │   │  └─ user_identity
│  │   │     └─ user_identity_types.ex
│  │   └─ schema.ex
│  ├─ some_project_name_web
```

The permission system that comes with Potionx is based on roles, a property of users. You can see them in your ```user.ex``` file:

```elixir
defmodule SomeProject.Users.User do
  import Ecto.Changeset
  use Ecto.Schema
  use Potionx.Users.User

  schema "users" do
    # ... other fields
    field :roles, {:array, Ecto.Enum}, values: [:admin, :guest] # Roles are here

    has_many :user_identities, SomeProject.UserIdentities.UserIdentity
    timestamps()
  end
end
```

To alter mutation or query permissions for a particular model, open the mutation or query file for that model and edit the roles:

For example, to allow the role ```:guest``` to query users, open ```user_queries.ex``` and add ```:guest``` to the roles list:
```elixir
defmodule SomeProjectGraphQl.Schema.UserQueries do
  use Absinthe.Schema.Notation
  use Absinthe.Relay.Schema.Notation, :modern

  object :user_queries do
    connection field :user_collection, node_type: :user do
      arg :filters, :user_filters
      arg :order, type: :sort_order, default_value: :asc
      # middleware Potionx.Middleware.RolesAuthorization, [roles: [:admin]] OLD
      middleware Potionx.Middleware.RolesAuthorization, [roles: [:admin, :guest]] # NEW
      resolve &SomeProjectGraphQl.Resolver.User.collection/2
    end

    field :user_single, type: :user do
      arg :filters, :user_filters_single
      # middleware Potionx.Middleware.RolesAuthorization, [roles: [:admin]] OLD
      middleware Potionx.Middleware.RolesAuthorization, [roles: [:admin, :guest]] # NEW
      resolve &SomeProjectGraphQl.Resolver.User.one/2
    end
  end
end
````

The ```roles``` option of the ```Potionx.Middleware.RolesAuthorization``` middleware expects a list of roles that are allowed to access or mutation the resource of interest.

To learn more about the ```Potionx.Middleware.RolesAuthorization``` middleware and the GraphQL layer, see the [architecture section on GraphQL](/conventions/graphql-layer.html).


## Restricting access to routes on the frontend
Coming soon...