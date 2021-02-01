import { defineComponent } from "vue";
import { useQuery } from "@urql/vue";
import { UserEdge } from "shared/types";
import userCollectionGql from "shared/models/Users/user/userCollection.gql.ts";

export default defineComponent({
  setup () {
    const q = useQuery({
      query: userCollectionGql,
      variables: {
        first: 50
      }
    })

    return () => {
      return <div>
        {
          q.data.value?.userCollection.edges
            .map((edge: UserEdge) =>
              <div>{edge.node?.email}</div>
            )
        }
      </div>
    }
  }
})