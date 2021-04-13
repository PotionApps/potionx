defmodule Potionx.Types do
  use Absinthe.Schema.Notation

  enum :sort_order do
    value :asc
    value :desc
  end
  object :error do
    field :field, :string
    field :message, :string
  end

  object :sign_in_provider_result do
    field :error, :string
    field :url, :string
  end

  scalar :string_bool do
    parse fn
      %{value: v} ->
        case v do
          nil ->
            {:ok, false}
          true ->
            {:ok, true}
          false ->
            {:ok, false}
          0 ->
            {:ok, false}
          1 ->
            {:ok, true}
          "0" ->
            {:ok, false}
          "1" ->
            {:ok, true}
          "all" ->
            {:ok, "all"}
        end
      _ ->
        {:ok, nil}
    end
end

defmodule Potionx.Types.JSON do
  @moduledoc """
  The Json scalar type allows arbitrary JSON values to be passed in and out.
  Requires `{ :jason, "~> 1.1" }` package: https://github.com/michalmuskala/jason
  """
  use Absinthe.Schema.Notation

  scalar :json, name: "Json" do
    description("""
    The `Json` scalar type represents arbitrary json string data, represented as UTF-8
    character sequences. The Json type is most often used to represent a free-form
    human-readable json string.
    """)

    serialize(&encode/1)
    parse(&decode/1)
  end

  @spec decode(Absinthe.Blueprint.Input.String.t()) :: {:ok, term()} | :error
  @spec decode(Absinthe.Blueprint.Input.Null.t()) :: {:ok, nil}
  defp decode(%Absinthe.Blueprint.Input.String{value: value}) do
    case Jason.decode(value) do
      {:ok, result} -> {:ok, result}
      _ -> :error
    end
  end

  defp decode(%Absinthe.Blueprint.Input.Null{}) do
    {:ok, nil}
  end

  defp decode(_) do
    :error
  end

  defp encode(value), do: value
end
