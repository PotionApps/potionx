defmodule Potionx.Auth.Store do
  @callback delete(Potionx.Context.Service.t()) :: {:ok, struct()} | {:error, String.t()}
  @callback one(Potionx.Context.Service.t()) :: struct()
  @callback one_from_cache(Potionx.Context.Service.t()) :: struct()
  @callback mutation(Potionx.Context.Service.t()) :: {:ok, struct()} | {:error, map()}
end