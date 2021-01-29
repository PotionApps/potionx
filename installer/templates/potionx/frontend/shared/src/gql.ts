// Takes string literral and returns it.
// To be used as a lighter replacement for graphql-tag package to get syntax highlighting.
export const gql = (s: TemplateStringsArray) => s?.[0]
export default gql