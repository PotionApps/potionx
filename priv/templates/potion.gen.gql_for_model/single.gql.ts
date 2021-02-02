import gql from "../../../gql"
export default gql`query <%= model_name_graphql_case %>Single(
  $filters: <%= model_name %>FiltersSingle
) {
  <%= model_name_graphql_case %>Single(
    filters: $filters
  ) {
    <%= for field <- graphql_fields do %><%= field %>
    <% end %>
  }
}`