defmodule <%= appModule %>.Health do
  @doc """
  Check if required services are loaded and startup
  tasks completed
  """
  def has_started? do
    is_ready?()
  end

  @doc """
  Check if app is alive should be serving public traffic
  """
  def is_alive? do
    true
  end

  @doc """
  Check if app is ready and working, by making a simple
  request to the DB
  """
  def is_ready? do
    !!Ecto.Adapters.SQL.query!(<%= appModule %>.Repo, "SELECT 1")
  rescue
    _e -> false
  end
end
