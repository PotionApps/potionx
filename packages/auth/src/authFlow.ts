export type AuthFlowArgs = {
  provider: string
}

export default async (args: AuthFlowArgs) => {
  const {
    data: {
      url
    }
  } = await fetch(
      `/api/v1/auth/${args.provider}/new`
    )
    .then(res => res.json())
  window.location = url;
}