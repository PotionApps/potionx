export default async () => {
  return await fetch(
    `/graphql/v1`, 
    {
      body: JSON.stringify({
        query: `mutation {
          sessionRenew {
            error
          }
        }`
      }),
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "same-origin",
      method: "POST"
    }
  )
  .then(resp => resp.json())
}