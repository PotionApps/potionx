import { computed, defineComponent } from 'vue'
import { useQuery } from "@urql/vue";
import { <%= model_name %>Edge } from "shared/types";
import collection from 'shared/models/<%= context_name %>/<%= model_name %>/<%= model_name_graphql_case %>Collection.gql.ts'
import ModelTable, { ModelTableProps } from '@potionapps/ui/ModelTable'
import schema from 'shared/models/<%= context_name %>/<%= model_name %>/<%= model_name_graphql_case %>.json'

export default defineComponent({
  setup () {
    const q = useQuery({
      query: collection,
      variables: {
        first: 50
      }
    })

    const headerLabels =
      schema.map((s: any) => ({
        key: s.name,
        label: s.label || s.name
      }))

    const modelTableProps = computed<ModelTableProps>(() => {
      return {
        headerLabels,
        rows: q.data.value?.userCollection.edges.map((edge: <%= model_name %>Edge) => edge.node)
      }
    })

    return () => {
      return <ModelTable
          {...modelTableProps.value}
        />
    }
  }
})