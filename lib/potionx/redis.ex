defmodule Potionx.Redis do
  @redix_instance_name :redix

  def delete(%{model_name: _, id: _} = params) do
    Redix.command!(
      @redix_instance_name,
      ["DEL", to_global_id(params)]
     )
  end

  def get(%{model_name: _, id: _} = params) do
    Redix.command!(
      @redix_instance_name,
      ["GET", to_global_id(params)]
    )
  end

  def put(%{model_name: _, id: _, value: value} = params, ttl_ms) do
    Redix.command!(
      @redix_instance_name,
      ["SET", to_global_id(params), value, "PX", ttl_ms]
    )
  end

  def to_global_id(%{model_name: model_name, id: id}) when not is_nil(id) do
    Enum.join([model_name, id], ":")
  end
end
