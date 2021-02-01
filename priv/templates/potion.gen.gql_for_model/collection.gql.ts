import gql from "../../../gql"
export default gql`query <%= model_name_graphql_case %>Collection(
  $after: String,
  $before: String,
  $first: Int,
  $last: Int,
  $filters: <%= model_name %>Filters
) {
  <%= model_name_graphql_case %>Collection(
    after: $after,
    before: $before,
    first: $first,
    filters: $filters,
    last: $last
  ) {
    pageInfo {
      endCursor
      hasNextPage
      hasPreviousPage
      startCursor
    }
    edges {
      node {
      <%= for field <- graphql_fields do %>
        <%= field %>
      <% end %>
      }
      cursor
    }
  }
}`