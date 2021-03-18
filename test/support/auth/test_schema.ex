defmodule PotionxTest.Schema do
  use Potionx.Schema

  import_types Potionx.Types

  query do
  end

  mutation do
    import_fields :auth_mutations
  end
  import_types PotionxTest.Mutations
end
