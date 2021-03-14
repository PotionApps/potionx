defmodule Potionx.Utils.Ecto do
  @doc """
  Reduce results to an atom. Returns error if one of the results failed, otherwise
  returns ok.
  """
  def reduce_results(results) do
    Enum.reduce(results, {:ok, []}, fn res, acc ->
      case acc do
        {:ok, models} ->
          case res do
            {:ok, model} ->
              {:ok, models ++ [model]}
            err ->
              err
          end
        err ->
          err
      end
    end)
  end
end