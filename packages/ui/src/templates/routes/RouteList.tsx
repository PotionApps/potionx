import { defineComponent, computed } from "vue"
import { faEmptySet } from '@fortawesome/free-solid-svg-icons'
import { RootQueryType } from "shared/types";
import { routeNames } from 'root/routes/routeNames'
import { useQuery } from "@urql/vue";
import AdminBody from 'root/components/AdminBody/AdminBody'
import AdminFooter from 'root/components/AdminFooter/AdminFooter'
import AdminHeader from 'root/components/AdminHeader/AdminHeader'
import AdminShell from 'root/components/AdminShell/AdminShell'
import AdminTitle from 'root/components/AdminTitle/AdminTitle'
import Btn from 'root/components/Btn/Btn'
import BtnMobileMenu from 'root/components/Btn/BtnMobileMenu'
import collection from 'shared/models/TEMP_context/TEMP_model/TEMP_model_graphql_caseCollection.gql.ts'
import schema from 'shared/models/TEMP_context/TEMP_model/TEMP_model_graphql_case.json'
import StateEmpty from 'root/components/StateEmpty/StateEmpty'
import StateLoading from 'root/components/StateLoading/StateLoading'

export default defineComponent({
  setup () {
    const headerLabels =
      schema.map((s: any) => ({
        key: s.name,
        label: s.label || s.name
      }))

   const modelTableHeaderLabels =
    schema.map((s: any) => ({
      key: s.name,
      label: s.label || s.name
    }))

    const modelTableProps = computed(() => {
      return {
        headerLabels,
        rows: data.value?.TEMP_model_graphql_caseCollection?.edges?.map((edge) => edge!.node) || []
      }
    })

    const newEntryLink = {
      name: routeNames.TEMP_model_graphql_caseEdit,
      params: {
        id: 'new'
      }
    }

    const { data, fetching } = useQuery<RootQueryType>({
      query: collection,
      variables: {
        first: 50
      }
    })

    return () => <AdminShell>
      <AdminHeader
        v-slots={{
          btns: () => <Btn
            class="s1050m:hidden"
            label="New TEMP_model_name"
            reverse={true}
            to={newEntryLink}
          />
        }}
      >
        <AdminTitle>TEMP_model_name Management</AdminTitle>
      </AdminHeader>
      <AdminBody>
        {
          data.value?.TEMP_model_graphql_caseCollection?.count! > 0 &&
            <StateEmpty class="pb-2 pt-4" icon={faEmptySet} label="No Results" />
        }
        {
          fetching.value &&
            <StateLoading class="pb-2 pt-4"/>
        }
      </AdminBody>
      <AdminFooter>
        <BtnMobileMenu
          label="New TEMP_model_name"
          to={newEntryLink}
        />
      </AdminFooter>
    </AdminShell>
  }
})