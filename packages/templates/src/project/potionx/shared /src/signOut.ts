export default async () => {
  await fetch(
    `/api/v1/session/delete`
  )
  window.location.href = "/login";
}