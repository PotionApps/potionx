import gql from "../../../gql"
export default gql`mutation <%= model_name_graphql_case %>Delete(
  $filters: <%= model_name %>FiltersSingle
) {
  <%= model_name_graphql_case %>Delete(
    filters: $filters
  ) {
    errors
    errorsFields {
      field
      message
    }
    node {
    <%= for field <- graphql_fields do %>
      <%= field %>
    <% end %>
    }
  }
}`