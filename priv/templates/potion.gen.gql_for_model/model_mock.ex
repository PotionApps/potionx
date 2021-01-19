defmodule <%= module_name_data %>.<%= context_name %>.<%= model_name %>Mock do
  def run do
<%= mock %>
  end

  def run_patch do
<%= mock_patch %>
  end
end
