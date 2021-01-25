export type AuthFlowArgs = {
  provider: string
}

export default async (args: AuthFlowArgs) => {
  try {
    const {
      data: {
        session_params,
        url
      }
    } = await fetch(
        `/api/v1/auth/${args.provider}/new`
      )
      .then(res => res.json())
    window.location = url;
  } catch (e) {
    console.log(e)
  }
}