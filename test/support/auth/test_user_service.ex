defmodule PotionxTest.UserService do
  import Ecto.Query
  def one(ctx) do
    query(ctx)
    |> PotionxTest.Repo.one
  end
  def query(ctx) do
    PotionxTest.User
    |> where(
      ^(
        ctx.filters
        |> Map.to_list
      )
    )
    |> order_by([desc: :id])
  end
  def query(q, _args), do: q

  def sign_in(ctx) do
    one(ctx)
  end
end
