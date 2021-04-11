defmodule Potionx.GraphQl.Swell.ProductTypes do
  use Absinthe.Schema.Notation
  use Absinthe.Relay.Schema.Notation, :modern

  enum :discount_type_swell do
    value :fixed
    value :percent
  end

  enum :delivery_swell do
    value :shipment
    value :subscription
    value :giftcard
  end

  enum :stock_status_swell do
    value :available
    value :backorder
    value :preorder
  end

  node object :file_swell do
    field :content_type, :string
    field :date_uploaded, :string
    field :height, :integer
    field :length, :integer
    field :md5, :string
    field :url, :string
    field :width, :integer
  end

  node object :image_swell do
    field :file, :file_swell
  end

  object :price_swell do
    field :account_group, :string
    field :price, :decimal
    field :quantity_max, :integer
    field :quantity_min, :integer
  end

  object :product_cross_sell_swell do
    field :id, :string
    field :discount_amount, :integer
    field :discount_percent, :integer
    field :discount_type, :discount_type_swell  do
      resolve fn el, _, _ ->
        {:ok, String.to_existing_atom(el.discount_type)}
      end
    end
    field :product, :string
    field :product_id, :string
  end

  object :product_option_swell do
    field :id, :string
    field :input_hint, :string
    field :input_type, :string
    field :name, :string
    field :parent_id, :id
    field :parent_value_ids, list_of(:id)
    field :required, :boolean
    field :subscription, :boolean
    field :variant, :boolean
    field :values, list_of(:product_option_value_swell)
  end

  object :product_option_value_swell do
    field :id, :string
    field :name, :string
    field :price, :decimal
  end

  node object :product_swell do
    field :active, :boolean
    field :attributes, :json
    field :cost, :integer
    field :cross_sells, list_of(:product_cross_sell_swell)
    field :currency, :string
    field :date_created, :string
    field :date_updated, :string
    field :delivery, :delivery_swell do
      resolve fn el, _, _ ->
        {:ok, String.to_existing_atom(el.delivery)}
      end
    end
    field :description, :string
    field :images, list_of(:image_swell)
    field :meta_description, :string
    field :meta_title, :string
    field :name, :string
    field :options, list_of(:product_option_swell)
    field :price, :decimal
    field :prices, list_of(:price_swell)
    field :review_rating, :decimal
    field :slug, :string
    field :stock_level, :integer
    field :stock_status, :stock_status_swell
  end

  # "tags": [],
  # "type": "standard"
end
