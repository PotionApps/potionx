export default async () => {
  await fetch(
    `/graphql/v1`, 
    {
      body: JSON.stringify({
        query: `mutation {
          signOut {
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
  window.location.href = "/login";
}