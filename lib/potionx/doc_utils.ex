defmodule Potionx.DocUtils do
  def indent_to_string(0) do
    ""
  end
  def indent_to_string(indent) do
    Enum.reduce(1..indent, "", fn _, acc -> acc <> " " end)
  end

  def insert_list(list, index, list_to_insert) do
    Enum.concat(
      [
        Enum.slice(list, 0..(index-1)),
        list_to_insert,
        Enum.slice(list, index..-1)
      ]
    )
  end
end
