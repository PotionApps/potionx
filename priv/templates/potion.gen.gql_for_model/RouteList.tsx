import { computed, defineComponent } from 'vue'
import { ModelTable } from '@potionapps/ui/ModelTable'
import { useQuery } from "@urql/vue";
import collection from 'shared/models/<%= context_name %>/<%= model_name_snakecase %>Collection.gql.ts'
import schema from 'shared/models/<%= context_name %>/<%= model_name_snakecase %>.json'

export default defineComponent({
  setup () {
    const q = useQuery({
      query: collection,
      variables: {
        first: 50
      }
    })

    const headerLabels =
      schema.map(s => ({
        key: s.name,
        label: s.label || s.name
      }))

    const modelTableProps = computed<ModelTable>(() => {
      return {
        headerLabels,
        rows: q.data.value?.userCollection.edges.map(edge => edge.node)
      }
    })

    return () => {
      return <ModelTable
          {...modelTableProps.value}
        />
    }
  }
})