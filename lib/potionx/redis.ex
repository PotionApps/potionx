defmodule Potionx.Redis do
  @redix_instance_name :redix

  def delete(id) do
    Redix.command(
      @redix_instance_name,
      ["DEL", id]
     )
  end

  def get(id) do
    Redix.command(
      @redix_instance_name,
      ["GET", id]
    )
  end

  def put(key, value, ttl_ms) do
    Redix.command(
      @redix_instance_name,
      ["SET", key, value, "PX", ttl_ms]
    )
  end
end
