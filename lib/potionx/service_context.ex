defmodule Potionx.Context.Service do
  use TypedStruct

  typedstruct do
    field :changes, map(), default: %{}
    field :file, Plug.Upload.t()
    field :filters, map(), default: %{}
    field :organization, struct()
    field :roles, [String.t()], default: []
    field :session_fingerprint, String.t()
    field :user, struct()
  end
end
