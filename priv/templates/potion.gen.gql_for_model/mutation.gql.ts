import gql from "../../../gql"
export default gql`mutation <%= model_name_graphql_case %>Mutation(
  $changes: <%= model_name %>Input,
  $filters: <%= model_name %>FiltersSingle
) {
  <%= model_name_graphql_case %>Mutation(
    changes: $changes,
    filters: $filters
  ) {
    errors
    errorsFields {
      field
      message
    }
    node {
      <%= for field <- graphql_fields do %><%= field %>
      <% end %>
    }
  }
}`