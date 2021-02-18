import { defineComponent, computed } from "vue"
import { RootQueryType } from "shared/types";
import { routeNames } from 'root/routes/routeNames'
import { useRouter } from "vue-router";
import { useQuery } from "@urql/vue";
import AdminBody from 'root/components/AdminBody/AdminBody'
import AdminFooter from 'root/components/AdminFooter/AdminFooter'
import AdminHeader from 'root/components/AdminHeader/AdminHeader'
import AdminHeaderBtnWrap from "root/components/AdminHeaderBtnWrap/AdminHeaderBtnWrap";
import AdminShell from 'root/components/AdminShell/AdminShell'
import AdminTitle from 'root/components/AdminTitle/AdminTitle'
import Btn from 'root/components/Btn/Btn'
import BtnMobileMenu from 'root/components/Btn/BtnMobileMenu'
import collection from 'shared/models/TEMP_context/TEMP_model/TEMP_model_graphql_caseCollection.gql.ts'
import ModelTable, { ModelTableProps } from 'root/components/ModelTable/ModelTable'
import schema from 'shared/models/TEMP_context/TEMP_model/TEMP_model_graphql_case.json'
import StateEmpty from 'root/components/StateEmpty/StateEmpty'
import StateLoading from 'root/components/StateLoading/StateLoading'

export default defineComponent({
  setup () {
    const router = useRouter()
    const headingLabels =
      schema.map((s: any) => ({
        key: s.name,
        label: s.label || s.name
      }))

    const modelTableProps = computed<ModelTableProps>(() => {
      return {
        checkboxClick: (row) => {
          router.push({
            name: routeNames.TEMP_model_graphql_caseEdit,
            params: {
              id: row.id!
            }
          })
        },
        headingLabels,
        rows: data.value?.TEMP_model_graphql_caseCollection?.edges?.map((edge) => edge!.node!).filter(n => n)
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
          btns: () => 
          <AdminHeaderBtnWrap>
            <Btn
              label="New TEMP_model"
              reverse={true}
              to={newEntryLink}
            />
          </AdminHeaderBtnWrap>
        }}
      >
        <AdminTitle>TEMP_model Management</AdminTitle>
      </AdminHeader>
      <AdminBody>
        {
          data.value?.TEMP_model_graphql_caseCollection?.count! > 0 &&
            <StateEmpty class="pb-2 pt-4" label="No Results" />
        }
        {
          fetching.value &&
            <StateLoading class="pb-2 pt-4"/>
        }
        {
          !!data.value?.userCollection?.edges?.length &&
          <ModelTable {...modelTableProps.value} />
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