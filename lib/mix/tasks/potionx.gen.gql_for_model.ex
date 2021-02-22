defmodule Mix.Tasks.Potionx.Gen.GqlForModel do
  alias __MODULE__
  @shortdoc "Generates GraphQL mutations, queries and types for an Ecto model"
  @task_name "potion.gen.gql_for_model"
  @default_opts [schema: true, context: true]
  @switches [binary_id: :boolean, table: :string, web: :string,
             schema: :boolean, context: :boolean, context_app: :string, no_associations: :boolean]
  defstruct app_otp: nil,
            context_name: nil,
            context_name_snakecase: nil,
            module_name_data: nil,
            module_name_graphql: nil,
            dir_context: nil,
            dir_graphql: nil,
            dir_test: nil,
            graphql_fields: nil,
            lines: %{},
            potion_name: "Potionx",
            mock: nil,
            mock_patch: nil,
            model: nil,
            model_name_atom: nil,
            model_file_path: nil,
            model_name: nil,
            model_name_graphql_case: nil,
            model_name_snakecase: nil,
            no_associations: false,
            no_frontend: false,
            no_mutations: false,
            no_queries: false,
            validations: []

  use Mix.Task
  alias Mix.Phoenix.{Context, Schema}
  alias Potionx.DocUtils

  def add_lines_to_block(block, lines_to_add, start_line, indent_size) when is_binary(start_line) do
    start_index = Enum.find_index(block, fn l ->
      String.starts_with?(l, start_line)
    end)
    add_lines_to_block(block, lines_to_add, start_index, indent_size)
  end
  def add_lines_to_block(block, lines_to_add, start_index, indent_size) do
    end_index =
      Enum.slice(block, start_index..-1)
      |> Enum.find_index(fn l ->
        String.starts_with?(l, DocUtils.indent_to_string(indent_size) <> "end")
      end)
    end_index = end_index + start_index
    Enum.concat(
      [
        Enum.slice(block, 0..(end_index - 1)),
        lines_to_add,
        Enum.slice(block, end_index..-1)
      ]
    )
  end

  @doc false
  def build(args) do
    {opts, parsed, _} = parse_opts(args)
    {opts, validate_args!(parsed)}
  end

  def common_fields do
    [:description, :title]
  end

  def ensure_files_and_directories_exist(%GqlForModel{} = state) do
    if (not File.dir?(state.dir_context)) do
      Mix.raise """
      Context directory #{state.dir_context} is missing
      """
    end
    files_to_be_generated(state)
    |> Enum.map(fn {k, path_enum} ->
      File.mkdir_p!(Path.join(Enum.slice(path_enum, 0..-2)))
      path = Path.join(path_enum)
      file_name =
        cond do
        String.ends_with?(to_string(k), "_test") ->
          to_string(k) <> ".exs"
        String.ends_with?(to_string(k), "_json") ->
          String.replace_trailing(to_string(k), "_json", "") <> ".json"
        true ->
          to_string(k) <> ".ex"
        end
      # if does not exist, create using templates
      if not File.exists?(path) do
        EEx.eval_string(
          Application.app_dir(
            :potionx,
            "priv/templates/#{@task_name}/#{file_name}"
          )
          |> File.read!,
          Enum.map(Map.from_struct(state), &(&1))
        )
        |> (fn res ->
          File.write!(path, res)
        end).()
      end
    end)

    state
  end
  def field_type_from_validations(type, validations) do
    Enum.find(validations, fn
      %{name: :inclusion} -> true
      _ -> false
    end)
    |> case do
      nil -> type
      type -> type
    end
  end


  @doc false
  def files_to_be_generated(%GqlForModel{} = state) do
    %{
      app_schema: [state.dir_graphql, "schema.ex"],
      model_mock: [state.dir_context, "#{state.model_name_snakecase}_mock.ex"],
      model_mock_json: [
        "shared",
        "src",
        "models",
        state.context_name,
        state.model_name,
        "#{state.model_name_graphql_case}.mock.json"
      ],
      model_json: [
        "shared",
        "src",
        "models",
        state.context_name,
        state.model_name,
        "#{state.model_name_graphql_case}.json"
      ],
      mutations: [state.dir_graphql, "schemas", state.model_name_snakecase, "#{state.model_name_snakecase}_mutations.ex"],
      mutations_test: [state.dir_test, "mutations", "#{state.model_name_snakecase}_mutations_test.exs"],
      queries: [state.dir_graphql, "schemas", state.model_name_snakecase, "#{state.model_name_snakecase}_queries.ex"],
      queries_test: [state.dir_test, "queries", "#{state.model_name_snakecase}_queries_test.exs"],
      resolver: [state.dir_graphql, "resolvers", "#{state.model_name_snakecase}_resolver.ex"],
      service: [state.dir_context,  "#{state.model_name_snakecase}_service.ex"],
      types: [state.dir_graphql, "schemas", state.model_name_snakecase, "#{state.model_name_snakecase}_types.ex"],
    }
    |> (fn res ->
      [{:no_mutations, "mutations"}, {:no_queries, "queries"}]
      |> Enum.reduce(res, fn {k, v}, acc ->
        if (Map.get(state, k)) do
          Map.drop(acc, [String.to_atom(v), String.to_atom(v <> "_test")])
        else
          acc
        end
      end)
    end).()
  end

  def keyword_list_to_map(list) do
    if (Keyword.keyword?(list)) do
      Enum.into(list, %{})
    else
      list
    end
  end

  def load_lines(%GqlForModel{} = state) do
    files_to_be_generated(state)
    |> Enum.filter(fn {k, _} -> Enum.member?([:app_schema, :mutations, :types, :queries], k) end)
    |> Enum.reduce(state, fn {k, path_enum}, state ->
      lines =
        File.read!(
          Path.join(path_enum)
        )
        |> String.trim
        |> String.split(~r{(\r?)\n})
      %{
        state |
          lines: Map.put(state.lines, k, lines)
      }
    end)
  end

  def load_model(%GqlForModel{} = state, nil) do
     %{
       state | model: [
        "Elixir",
        state.module_name_data,
        state.context_name,
        state.model_name
      ]
      |> Enum.join(".")
      |> String.to_atom
    }
  end
  def load_model(%GqlForModel{} = state, model), do: %{state | model: model}

  def load_validations(%GqlForModel{} = state) do
    %{
      state | validations: validations(
        state.model.changeset(struct(state.model, %{}), %{})
      )
    }
  end

  def maybe_add_default_types(%GqlForModel{} = state) do
    [
      {
        "input_object :#{state.model_name_atom}_filters_single do",
        [
          "field :id, non_null(:global_id)"
        ]
      },
      {
        "object :#{state.model_name_snakecase}_mutation_result do",
        [
          "field :errors, list_of(:string)",
          "field :errors_fields, list_of(:error)",
          "field :node, :#{state.model_name_snakecase}",
          "field :success_msg, :string"
        ]
      }
      # {
      #   "object #{state.model_name_snakecase}_collection_result do",
      #   [
      #     ":errors, list_of(:string)",
      #     ":nodes, list_of(#{state.model_name_snakecase})",
      #     ":query_info, :query_info"
      #   ]
      # },
    ]
    |> Enum.reduce(state, fn {head, lines}, acc ->
      if Enum.find(acc.lines.types, fn l -> String.contains?(l, head) end) do
        acc
      else
        block_to_add = Enum.concat([
          [DocUtils.indent_to_string(2) <> head],
          Enum.map(lines, fn l -> DocUtils.indent_to_string(4) <> l end),
          [DocUtils.indent_to_string(2) <> "end"]
        ])
        %{
          acc |
            lines: Map.put(acc.lines, :types,
              add_lines_to_block(acc.lines.types, block_to_add, Enum.at(acc.lines.types, 0), 0)
            )
        }
      end
    end)
  end

  def maybe_add_line(block, line, indent_size, close \\ false) do
    lines_to_add =
      block
      |> Enum.find_index(fn l ->
        String.contains?(l, line)
      end)
      |> case do
        nil ->
          [DocUtils.indent_to_string(indent_size) <> line]
          |> (fn res ->
            if close do
              Enum.concat([res, [DocUtils.indent_to_string(indent_size) <> "end"]])
            else
              res
            end
          end).()
        _ ->
          []
      end
    add_lines_to_block(block, lines_to_add, Enum.at(block, 0), indent_size - 2)
  end

  def maybe_add_node_interface_type_resolve(%GqlForModel{} = state) do
    # look for node interface, next line is resolve type
    # insert into resolve_type block
    interface_block_start_index = Enum.find_index(state.lines.app_schema, fn l ->
      String.starts_with?(
        l,
        DocUtils.indent_to_string(2) <> "node interface"
      )
    end)
    Enum.find(state.lines.app_schema, fn l ->
      String.contains?(
        l,
        "#{state.module_name_data}.#{state.context_name}.#{state.model_name}{}, _ ->"
      )
    end)
    |> if do
      state
    else
      %{
        state |
          lines: Map.put(
            state.lines,
            :app_schema,
            Enum.concat(
              [
                Enum.slice(state.lines.app_schema, 0..interface_block_start_index+1),
                [
                  DocUtils.indent_to_string(6) <> "%#{state.module_name_data}.#{state.context_name}.#{state.model_name}{}, _ ->",
                  DocUtils.indent_to_string(8) <> ":#{state.model_name_atom}"
                ],
                Enum.slice(state.lines.app_schema, (interface_block_start_index+2)..-1)
              ]
            )
          )
      }
    end
  end

  def maybe_convert_type(type) do
    case type do
      :utc_datetime -> :datetime
      _ -> type
    end
  end

  def maybe_init_types(%GqlForModel{} = state) do
    Enum.map(types(state), fn line ->
      {:types, line}
    end)
    |> Enum.reduce(state, fn {k, v}, acc ->
      %{
        acc |
          lines:
            Map.put(
              acc.lines,
              k,
              maybe_add_line(Map.get(acc.lines, k), v, 2, true)
              |> (fn lines_types ->
                lines_types
                |> Enum.find_index(fn l ->
                  String.contains?(l, "connection node_type: :#{state.model_name_atom}")
                end)
                |> case do
                  nil ->
                    add_lines_to_block(
                      lines_types,
                      [
                        DocUtils.indent_to_string(2) <> "connection node_type: :#{state.model_name_atom} do",
                        DocUtils.indent_to_string(4) <> "field :count, non_null(:integer)",
                        DocUtils.indent_to_string(4) <> "edge do",
                        DocUtils.indent_to_string(4) <> "end",
                        DocUtils.indent_to_string(2) <> "end"
                      ],
                      Enum.at(lines_types, 0),
                      0
                    )
                  _ -> lines_types
                end
              end).()
            )
      }
    end)
  end

  def maybe_update_main_schema(%GqlForModel{} = state) do
    [
      {:no_mutations, "import_types #{state.module_name_graphql}.Schema.#{state.model_name}Mutations"},
      {:no_queries, "import_types #{state.module_name_graphql}.Schema.#{state.model_name}Queries"},
      {:no_types, "import_types #{state.module_name_graphql}.Schema.#{state.model_name}Types"}
    ]
    |> Enum.reduce(state.lines.app_schema, fn {k, line}, acc ->
      if (Map.get(state, k)) do
        acc
      else
        maybe_add_line(
          acc,
          line,
          2
        )
      end
    end)
    |> (fn lines ->
      [
        {:no_mutations, "mutation do", "import_fields :#{state.model_name_snakecase}_mutations"},
        {:no_queries, "query do", "import_fields :#{state.model_name_snakecase}_queries"},
        {
          :no_mutations,
          "def dataloader",
          "|> Dataloader.add_source(#{state.module_name_graphql}.Resolver.#{state.model_name}, #{state.module_name_graphql}.Resolver.#{state.model_name}.data())"
        }
      ]
      |> Enum.reduce(lines, fn {flag, k, v}, acc ->
        (
          Map.get(state, flag) or
          Enum.find(acc, fn line -> String.contains?(line, v) end)
        )
        |> if do
          acc
        else
          add_lines_to_block(
            acc,
            [DocUtils.indent_to_string(4) <> v],
            DocUtils.indent_to_string(2) <> k,
            2
          )
        end
      end)
    end).()
    |> (fn lines ->
      %{state | lines: Map.put(state.lines, :app_schema, lines)}
    end).()
  end

  defp parse_opts(args) do
    {opts, parsed, invalid} = OptionParser.parse(args, switches: @switches)
    merged_opts =
      @default_opts
      |> Keyword.merge(opts)
      |> put_context_app(opts[:context_app])

    {merged_opts, parsed, invalid}
  end

  def prepare_mock(params,  type \\ :create) do
    params
    |> Enum.filter(fn
      {_, {:assoc, _}} -> false
      _ -> true
    end)
    |> Mix.Phoenix.Schema.params(type)
    |> Enum.map(fn
      {:email, _} ->
        {:email, type === :create && "test@example.com" || "test@example.com"}
      {k, v} ->
        {k, v}
    end)
    |> Enum.into(%{})
  end

  def pretty_print(m) do
    inspect(m, pretty: true)
    |> String.split(~r{(\r?)\n})
    |> Enum.map(fn l -> "    " <> l end)
    |> Enum.join("\r\n")
  end

  defp put_context_app(opts, nil), do: opts
  defp put_context_app(opts, string) do
    Keyword.put(opts, :context_app, String.to_atom(string))
  end

  @doc false
  @spec raise_with_help(String.t) :: no_return()
  def raise_with_help(msg) do
    Mix.raise """
    #{msg}

    mix #{@task_name} expects a
    context module name, followed by the singular module name

        mix #{@task_name} Accounts User

    The context serves as the API boundary for the given resource.
    Multiple resources may belong to a context and a resource may be
    split over distinct contexts (such as Accounts.User and Payments.User).
    """
  end

  @doc false
  def run(args) do
    model = Enum.find(args, fn a -> is_atom(a) end)
    args = Enum.filter(args, fn a -> not is_struct(a) end)

    if Mix.Project.umbrella? do
      Mix.raise "mix #{@task_name} can only be run inside an application directory"
    end
    if (!model) do
      Mix.Task.run("app.start")
    end
    {opts, [context, schema]} = build(args)

    this_app = Mix.Phoenix.otp_app()
    dir_context = Path.join(["lib", "#{this_app}", Macro.underscore(context)])
    %GqlForModel{
      app_otp: this_app,
      context_name: context,
      context_name_snakecase: Macro.underscore(context),
      dir_context: dir_context,
      dir_graphql: Path.join(["lib", "#{this_app}_graphql"]),
      dir_test: Path.join(["test", "#{this_app}_graphql"]),
      model_file_path: Path.join([dir_context, Macro.underscore(schema) <> ".ex"]),
      model_name: schema,
      model_name_atom: Macro.underscore(schema) |> String.to_atom,
      model_name_graphql_case: Macro.underscore(schema) |> Absinthe.Adapter.LanguageConventions.to_external_name(nil),
      model_name_snakecase: Macro.underscore(schema),
      module_name_data: Mix.Phoenix.context_base(
        Mix.Phoenix.context_app()
      ),
      module_name_graphql: Mix.Phoenix.context_base(
        Mix.Phoenix.context_app()
      ) <> "GraphQl",
      no_associations: Keyword.get(opts, :no_associations, false),
      no_frontend: Keyword.get(opts, :no_frontend, false),
      no_mutations: Keyword.get(opts, :no_mutations, false),
      no_queries: Keyword.get(opts, :no_queries, false)
    }
    |> ensure_files_and_directories_exist
    |> load_model(model)
    |> load_lines
    |> load_validations
    |> maybe_init_types
    |> sync_mocks
    |> sync_objects
    |> sync_graphql_files
    |> maybe_add_default_types
    |> maybe_add_node_interface_type_resolve
    |> maybe_update_main_schema
    |> sync_json_schema
    |> run_npx_generator
    |> write_lines_to_files
  end

  def run_npx_generator(%GqlForModel{no_frontend: true} = state), do: state
  def run_npx_generator(%GqlForModel{} = state) do
    Mix.shell().cmd(
      "npx potionapps-ui-route #{state.context_name} #{state.model_name} --destination=./frontend/admin"
    )
    state
  end

  def sync_graphql_files(%GqlForModel{} = state) do
    fields = prepare_mock(
      state.model.__changeset__
    )
    fields_computed =
      common_fields()
      |> Enum.reduce(%{}, fn key, fields ->
        if (function_exported?(state.model, key, 1))  do
          Map.put(fields, key, :string)
        else
          fields
        end
      end)
    state = %{
      state |
        graphql_fields:
          Map.merge(fields_computed, fields)
          |> Enum.reduce([], fn
            {_, {:assoc, _}}, acc ->
              acc
            {k, _}, acc ->
              acc ++ [Absinthe.Adapter.LanguageConventions.to_external_name(to_string(k), nil)]
          end)
    }
    [
      {
        :no_queries,
        "priv/templates/#{@task_name}/collection.gql.ts",
        [
          "shared",
          "src",
          "models",
          state.context_name,
          state.model_name,
          "#{state.model_name_graphql_case}Collection.gql.ts"
        ]
      },
      {
        :no_queries,
        "priv/templates/#{@task_name}/collection.gql",
        [
          "shared",
          "src",
          "models",
          state.context_name,
          state.model_name,
          "#{state.model_name_graphql_case}Collection.gql"
        ]
      },
      {
        :no_mutations,
        "priv/templates/#{@task_name}/delete.gql.ts",
        [
          "shared",
          "src",
          "models",
          state.context_name,
          state.model_name,
          "#{state.model_name_graphql_case}Delete.gql.ts"
        ]
      },
      {
        :no_mutations,
        "priv/templates/#{@task_name}/delete.gql",
        [
          "shared",
          "src",
          "models",
          state.context_name,
          state.model_name,
          "#{state.model_name_graphql_case}Delete.gql"
        ]
      },
      {
        :no_mutations,
        "priv/templates/#{@task_name}/mutation.gql.ts",
        [
          "shared",
          "src",
          "models",
          state.context_name,
          state.model_name,
          "#{state.model_name_graphql_case}Mutation.gql.ts"
        ]
      },
      {
        :no_mutations,
        "priv/templates/#{@task_name}/mutation.gql",
        [
          "shared",
          "src",
          "models",
          state.context_name,
          state.model_name,
          "#{state.model_name_graphql_case}Mutation.gql"
        ]
      },
      {
        :no_queries,
        "priv/templates/#{@task_name}/single.gql.ts",
        [
          "shared",
          "src",
          "models",
          state.context_name,
          state.model_name,
          "#{state.model_name_graphql_case}Single.gql.ts"
        ]
      },
      {
        :no_queries,
        "priv/templates/#{@task_name}/single.gql",
        [
          "shared",
          "src",
          "models",
          state.context_name,
          state.model_name,
          "#{state.model_name_graphql_case}Single.gql"
        ]
      }
    ]
    |> Enum.each(
      fn {flag, template, path_parts} ->
        unless Map.get(state, flag) do
          EEx.eval_string(
            Application.app_dir(
              :potionx,
              template
            )
            |> File.read!,
            Enum.map(
              Map.from_struct(state),
              &(&1)
            )
          )
          |> (fn res ->
            File.write!(
              Path.join(path_parts),
              res
            )
          end).()
        end
      end
    )

    state
  end

  def sync_json_schema(%GqlForModel{} = state) do
    model_json_raw = File.read!(
      files_to_be_generated(state).model_json
      |> Path.join
    )
    model_json = Jason.decode!(model_json_raw, keys: :atoms)
    state.model.__changeset__
    |> Enum.reduce(model_json, fn
      {_, {:assoc, _}}, acc -> acc
      {k, {:array, opts}}, acc ->
        options =
          case opts do
            {_, _, %{values: values}} -> values
            _ -> []
          end
        acc ++ [%{
          name: k,
          options: options,
          type: "checkbox",
          validations:
            Enum.reduce(state.validations, [], fn {key, v}, acc ->
              if (key === k) do
                acc ++ [v]
              else
                acc
              end
            end)
        }]
      {k, v}, acc ->
        cond do
          Enum.member?([:inserted_at, :updated_at], k) ->
            acc
          true ->
            validations =
              Enum.reduce(state.validations, [], fn {key, v}, acc ->
                if (key === k) do
                  acc ++ [v]
                else
                  acc
                end
              end)
              |> Enum.uniq_by(fn v ->
                v.name
              end)
            acc ++ [%{
              name: k,
              type: field_type_from_validations(v, validations),
              validations: validations
            }]
        end
    end)
    |> Enum.uniq_by(fn v ->
      v.name
    end)
    |> Enum.map(fn %{name: name} = field ->
      Map.put(
        field,
        :name,
        Absinthe.Adapter.LanguageConventions.to_external_name(
          to_string(
            name
          ),
          nil
        )
      )
      |> Map.put(
        :type,
        Absinthe.Adapter.LanguageConventions.to_external_name(
          to_string(
            field.type
          ),
          nil
        )
      )
    end)
    |> Jason.encode!(pretty: true)
    |> (fn res ->
      File.write!(
        files_to_be_generated(state).model_json
        |> Path.join,
        res
      )
    end).()

    state
  end

  def sync_mocks(%GqlForModel{} = state) do
    fields =
      prepare_mock(
        state.model.__changeset__
      )
    fields_patch = prepare_mock(
      state.model.__changeset__,
      :update
    )
    EEx.eval_string(
      Application.app_dir(
        :potionx,
        "priv/templates/#{@task_name}/model_mock.ex"
      )
      |> File.read!,
      Enum.map(
        Map.from_struct(state)
        |> Map.put(:mock, pretty_print(fields))
        |> Map.put(:mock_patch, pretty_print(fields_patch)),
        &(&1)
      )
    )
    |> (fn res ->
      File.write!(
        Path.join(files_to_be_generated(state).model_mock),
        res
      )
    end).()

    EEx.eval_string(
      Application.app_dir(
        :potionx,
        "priv/templates/#{@task_name}/model_mock.json"
      )
      |> File.read!,
      Enum.map(
        Map.from_struct(state)
        |> Map.put(
          :mock,
          fields
          |> Enum.reduce(%{}, fn {k, v}, acc ->
            Map.put(
              acc,
              Absinthe.Adapter.LanguageConventions.to_external_name(
                to_string(
                  k
                ),
                nil
              ),
              v
            )
          end)
          |> Jason.encode!(pretty: true)
        ),
        &(&1)
      )
    )
    |> (fn res ->
      File.write!(
        Path.join(files_to_be_generated(state).model_mock_json),
        res
      )
    end).()

    state
  end

  def sync_objects(%GqlForModel{} = state) do
    fields = state.model.__changeset__

    types(state)
    |> Enum.reduce(state, fn line, state ->
      lines = state.lines.types
      head_index =
        lines
        |> Enum.find_index(fn l -> String.contains?(l, line) end)
      tail_index =
        lines
        |> Enum.slice(head_index..-1)
        |> Enum.find_index(fn l -> String.contains?(l, DocUtils.indent_to_string(2) <> "end") end)
        |> Kernel.+(head_index)

      snippet =
        Enum.slice(lines, head_index..tail_index)

      Enum.reduce(fields, snippet, fn
        {k, {:array, _}}, acc ->
          acc ++ ["field :#{k}, list_of(:string)"]
        {k, {:assoc, ass}}, acc ->
          if String.starts_with?(line, "input_object") or state.no_associations do
            acc
          else
            model = ass.related |> to_string() |> String.split(".") |> Enum.at(-1) |> Macro.underscore()
            result_type = ass.cardinality === :many && "list_of(:#{model})" || model
            acc ++ ["field :#{to_string(k)}, #{result_type}, resolve: dataloader(#{state.module_name_graphql}.Resolver.#{state.model_name})"]
          end
        {:id, _}, acc ->
          acc
        {k, v}, acc ->
          acc ++ ["field :#{k}, :#{to_string(maybe_convert_type(v))}"]
      end)
      |> (fn lines ->
        common_fields()
        |> Enum.reduce(lines, fn key, lines ->
          if (function_exported?(state.model, key, 1) && not String.starts_with?(line, "input_object")) do
            lines ++ [
              "field :#{to_string(key)}, :string, resolve: Potionx.Resolvers.resolve_computed(#{to_string(state.module_name_data)}.#{to_string(state.context_name)}.#{to_string(state.model_name)}, :#{to_string(key)})"
            ]
          else
            lines
          end
        end)
      end).()
      |> Enum.reduce(snippet, fn line, acc ->
        maybe_add_line(acc, line, 4)
      end)
      |> (fn snippet ->
        head = Enum.slice(lines, 0..(head_index - 1))
        tail = Enum.slice(lines, (tail_index + 1)..-1)
        %{
          state | lines:
            Map.put(state.lines, :types, Enum.concat([head, snippet, tail]))
        }
      end).()
    end)
  end

  def types(%GqlForModel{} = state) do
    [
      "node object :#{state.model_name_atom} do",
      "input_object :#{state.model_name_atom}_filters do",
      "input_object :#{state.model_name_atom}_input do"
    ]
  end

  defp validate_args!([context, schema] = args) do
    cond do
      not Context.valid?(context) ->
        raise_with_help "Expected the context, #{inspect context}, to be a valid module name"
      not Schema.valid?(schema) ->
        raise_with_help "Expected the schema, #{inspect schema}, to be a valid module name"
      context == schema ->
        raise_with_help "The context and schema should have different names"
      true ->
        args
    end
  end
  defp validate_args!(_args) do
    raise_with_help "Invalid arguments"
  end

  def validations(%Ecto.Changeset{} = cs) do
    cs
    |> Map.get(:required)
    |> Enum.map(fn c -> {c, :required} end)
    |> Kernel.++(
      cs
      |> Ecto.Changeset.validations()
    )
    |> Enum.map(fn
      {k, :required = n} ->
        {k, %{
          name: n,
        }}
      {k, {:format = n, r}} ->
        {k, %{
          name: n,
          params: %{
            pattern: Regex.source(r)
          }
        }}
      {k, {n, params}} when n == :length or n == :number ->
        {k, %{
          name: n,
          params: keyword_list_to_map(params)
        }}
      {k, {n, values}} when n == :inclusion or n == :exclusion or n === :subset ->
        {k, %{
          name: n,
          params: %{
            values: keyword_list_to_map(values)
          }
        }}
      {k, {n, _}} ->
        {k, %{name: n}}
    end)
    |> Enum.map(fn {name, validation} ->
      {
        name,
        Map.put(
          validation,
          :name,
          Absinthe.Adapter.LanguageConventions.to_external_name(
            to_string(
              validation.name
            ),
            nil
          )
        )
      }
    end)
  end

  def write_lines_to_files(%GqlForModel{} = state) do
    files = files_to_be_generated(state)
    Enum.each(state.lines, fn {k, lines} ->
      File.write(
        Path.join(Map.get(files, k)),
        Enum.join(lines, "\r\n"),
        [:write]
      )
    end)
    state
  end
end
