defmodule Potionx.Utils.URITest do
  use Potionx.ConnCase
  alias PotionxTest.Router

  describe "URI test" do
    test "subdomain/1 should return subdomain" do
      assert Potionx.Utils.URI.subdomain(%Plug.Conn{}) === "www"
    end
    test "subdomain/1 should return nil" do
      assert Potionx.Utils.URI.subdomain(%Plug.Conn{host: "example.com"}) === nil
      assert Potionx.Utils.URI.subdomain(%Plug.Conn{host: ""}) === nil
    end
  end
end
