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
import collection from 'shared/models/__context__/__model__/__model_graphql_case__Collection.gql'
import ModelTable, { ModelTableProps } from 'root/components/ModelTable/ModelTable'
import schema from 'shared/models/__context__/__model__/__model_graphql_case__.json'
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
            name: routeNames.__model_graphql_case__Edit,
            params: {
              id: row.id!
            }
          })
        },
        headingLabels,
        rows: data.value?.__model_graphql_case__Collection?.edges?.map((edge) => edge!.node!).filter(n => n)
      }
    })

    const newEntryLink = {
      name: routeNames.__model_graphql_case__Edit,
      params: {
        id: 'new'
      }
    }

    const { data, fetching, error } = useQuery<RootQueryType>({
      query: collection,
      variables: {
        first: 50
      }
    })

    return () => {
    return <AdminShell>
      <AdminHeader
        v-slots={{
          btns: () => 
          <AdminHeaderBtnWrap>
            <Btn
              label="New __model"
              reverse={true}
              to={newEntryLink}
            />
          </AdminHeaderBtnWrap>
        }}
      >
        <AdminTitle>__model Management</AdminTitle>
      </AdminHeader>
      <AdminBody>
        {
          (error.value || data.value?.__model_graphql_case__Collection?.count! > 0) &&
            <StateEmpty class="pb-2 pt-4" label="No Results" />
        }
        {
          fetching.value &&
            <StateLoading class="pb-2 pt-4"/>
        }
        {
          !!data.value?.__model_graphql_case__Collection?.edges?.length &&
          <ModelTable {...modelTableProps.value} />
        }
      </AdminBody>
      <AdminFooter>
        <BtnMobileMenu
          label="New __model_name"
          to={newEntryLink}
        />
      </AdminFooter>
    </AdminShell>
  }}
})