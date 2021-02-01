import { computed, defineComponent } from 'vue'
import { useRoute } from 'vue-router'
import { useQuery } from "@urql/vue";
import { <%= model_name %> } from "shared/types";
import single from 'shared/models/<%= context_name %>/<%= model_name %>/<%= model_name_graphql_case %>Single.gql.ts'
import schema from 'shared/models/<%= context_name %>/<%= model_name %>/<%= model_name_graphql_case %>.json'

export default defineComponent({
  setup () {
    const route = useRoute()

    const q = useQuery({
      query: single,
      variables: computed(() => {
        return { id: route.params.id }
      }
    })

    return () => {
      return null
    }
  }
})