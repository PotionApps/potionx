defmodule Potionx.PowAssent.Context do
  use PowAssent.Ecto.UserIdentities.Context

  defp convert_params(params) when is_map(params) do
    params
    |> Enum.map(&convert_param/1)
    |> :maps.from_list()
  end

  defp convert_param({:uid, value}), do: convert_param({"uid", value})
  defp convert_param({"uid", value}) when is_integer(value), do: convert_param({"uid", Integer.to_string(value)})
  defp convert_param({key, value}) when is_atom(key), do: {Atom.to_string(key), value}
  defp convert_param({key, value}) when is_binary(key), do: {key, value}

  @doc """
  Inserts a changeset to the database.
  If succesful, the returned row will be reloaded from the database.
  """
  def do_insert(changeset, config, user) do
    opts = repo_opts(config, [:prefix])

    changeset
    |> Pow.Config.repo!(config).insert(opts)
    |> reload_after_write(config, user)
  end

  @doc """
  Updates a changeset in the database.
  If succesful, the returned row will be reloaded from the database.
  """
  def do_update(changeset, config, user) do
    opts = repo_opts(config, [:prefix])

    changeset
    |> Pow.Config.repo!(config).update(opts)
    |> reload_after_write(config, user)
  end

  defp get_for_user(user, %{"uid" => uid, "provider" => provider}, config) do
    user_identity = Ecto.build_assoc(user, :user_identities).__struct__

    repo!(config).get_by(user_identity, [user_id: user.id, provider: provider, uid: uid], repo_opts(config, [:prefix]))
  end

  defp insert_identity(user, user_identity_params, config) do
    user_identity = Ecto.build_assoc(user, :user_identities)

    user_identity
    |> user_identity.__struct__.changeset(user_identity_params)
    |> do_insert(config, user)
  end

  defp reload_after_write({:error, changeset}, _config, _user), do: {:error, changeset}
  defp reload_after_write({:ok, struct}, config, user) do
    # When ecto updates/inserts, has_many :through associations are set to nil.
    # So we'll just reload when writes happen.
    Pow.Operations.reload(user, config) || raise "Record does not exist: #{inspect user}"

    {:ok, struct}
  end

  defp repo_opts(config, opts) do
    config
    |> Pow.Config.get(:repo_opts, [])
    |> Keyword.take(opts)
  end

  defp unique_constraint_error?(errors, field) do
    Enum.find_value(errors, false, fn
      {^field, {_msg, [constraint: :unique, constraint_name: _name]}} -> true
      _any                                                            -> false
    end)
  end

  defp update_identity(user, user_identity, additional_params, config) do
    user_identity
    |> user_identity.__struct__.changeset(additional_params)
    |> do_update(config, user)
  end

  @doc """
  Upserts a user identity.
  If a matching user identity already exists for the user, the identity will be updated,
  otherwise a new identity is inserted.
  Repo module will be fetched from config.
  """
  def upsert(user, user_identity_params, config) do
    params                                   = convert_params(user_identity_params)
    {uid_provider_params, additional_params} = Map.split(params, ["uid", "provider"])

    user
    |> get_for_user(uid_provider_params, config)
    |> case do
      nil      -> insert_identity(user, params, config)
      identity -> update_identity(user, identity, additional_params, config)
    end
    |> user_identity_bound_different_user_error()
  end

  defp user_identity_bound_different_user_error({:error, %{errors: errors} = changeset}) do
    case unique_constraint_error?(errors, :uid_provider) do
      true  -> {:error, {:bound_to_different_user, changeset}}
      false -> {:error, changeset}
    end
  end
  defp user_identity_bound_different_user_error(any), do: any

  defdelegate user!(config), to: Pow.Config
  defdelegate repo!(config), to: Pow.Config
end