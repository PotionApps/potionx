defmodule <%= module_name_graphql %>.Resolver.<%= model_name %> do
  alias <%= potion_name %>.Context.Service
  alias <%= module_name_data %>.<%= context_name %>.<%= model_name %>Service
  use Absinthe.Relay.Schema.Notation, :modern

  def collection(%Service{} = ctx, _args) do
    <%= model_name %>Service.query(ctx)
    |> Absinthe.Relay.Connection.from_query(&<%= module_name_data %>.Repo.all/1, ctx.pagination)
  end

  def data do
    Dataloader.Ecto.new(<%= module_name_data %>.Repo, query: &<%= model_name %>Service.query/2)
  end

  def delete(%Service{} = ctx, _args) do
    <%= model_name %>Service.delete(ctx)
  end

  def mutation(%Service{} = ctx, _args) do
    <%= model_name %>Service.mutation(ctx)
  end

  def one(%Service{} = ctx, _args) do
    <%= model_name %>Service.one(ctx)
  end
end
