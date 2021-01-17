defmodule Potionx.Repo.Test do
  use ExUnit.Case
  alias __MODULE__

  defmodule User do
    use Ecto.Schema
    import Ecto
    import Ecto.Changeset

    schema "users" do
      field :test, :string
    end
  end

  defmodule Repo do
    use Potionx.Repo, [
      scoped_by_user: [User]
    ]
    import Ecto.Query

    def all do
      prepare_query(
        :all,
        from(u in User),
        default_options(nil)
      )
    end
  end

  describe "test repo" do
    test "test repo prepare_query fails when user_id not set" do
      assert_raise RuntimeError, "expected user_id to be set", fn ->
        Repo.all()
      end
    end

    test "test repo prepare_query returns successfully when user_id is set" do
      Potionx.Repo.put_user_id("1")
      Repo.all()
    end
  end
end
