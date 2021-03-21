defmodule Potionx.Auth.UserTest do
  use Potionx.ConnCase

  test "test user json gets decoded into a user struct" do
    json =
      Jason.encode!(%PotionxTest.User{id: 1, roles: [:admin]})
      |> Jason.decode!
    assert %PotionxTest.User{roles: [:admin]} = PotionxTest.User.from_json(json)
  end
end