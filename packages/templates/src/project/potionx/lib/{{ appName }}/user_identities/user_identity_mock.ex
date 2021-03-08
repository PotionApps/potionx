defmodule <%= appModule %>.UserIdentities.UserIdentityMock do
  def run do
    %{
      id: "some id",
      inserted_at: ~N[2010-04-17 14:00:00],
      provider: "some provider",
      uid: "some uid",
      updated_at: ~N[2010-04-17 14:00:00],
      user_id: "some user_id"
    }
  end

  def run_patch do
    %{
      id: "some updated id",
      inserted_at: ~N[2011-05-18 15:01:01],
      provider: "some updated provider",
      uid: "some updated uid",
      updated_at: ~N[2011-05-18 15:01:01],
      user_id: "some updated user_id"
    }
  end
end
