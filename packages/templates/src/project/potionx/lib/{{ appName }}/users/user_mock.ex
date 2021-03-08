defmodule <%= appModule %>.Users.UserMock do
  def run do
    %{
      deleted_at: "2010-04-17T14:00:00Z",
      email: "test@example.com",
      id: "some id",
      inserted_at: ~N[2010-04-17 14:00:00],
      name_first: "some name_first",
      name_last: "some name_last",
      roles: [],
      updated_at: ~N[2010-04-17 14:00:00]
    }
  end

  def run_patch do
    %{
      deleted_at: "2011-05-18T15:01:01Z",
      email: "test@example.com",
      id: "some updated id",
      inserted_at: ~N[2011-05-18 15:01:01],
      name_first: "some updated name_first",
      name_last: "some updated name_last",
      roles: [],
      updated_at: ~N[2011-05-18 15:01:01]
    }
  end
end
