defmodule Potionx.Plug.UrqlUpload do
  def call(%{params: %{"map" => map, "operations" => operations} = params} = conn, _opts) do
    map = Jason.decode!(map)
    next_params = Jason.decode!(operations)
    {changes, uploads} = Enum.reduce(map, {%{}, %{}}, fn {k, [key]}, {changes, uploads} ->
      file = Map.get(params, k)
      key = String.split(key, ".") |> Enum.at(-1)
      {
        Map.put(
          changes,
          key,
          file.filename
        ),
        Map.put(
          uploads,
          file.filename,
          file
        )
      }
    end)
    %{
      conn |
        params: %{
          next_params |
            "variables" => %{
              next_params["variables"] |
                "changes" => Map.merge(next_params["variables"]["changes"], changes)
            }
        }
        |> Map.merge(uploads)
      }
  end
  def call(conn, _opts), do: conn
  def init(opts), do: opts
end
