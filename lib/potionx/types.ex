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
end
