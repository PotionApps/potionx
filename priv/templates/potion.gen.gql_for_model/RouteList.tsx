import { ModelTableProps } from '@potionapps/ui'
import { defineComponent, computed } from "vue"
import { faEmptySet } from '@fortawesome/free-solid-svg-icons'
import { RootQueryType } from "shared/types";
import { useQuery } from "@urql/vue";
import AdminBody from 'root/components/AdminBody/AdminBody'
import AdminFooter from 'root/components/AdminFooter/AdminFooter'
import AdminHeader from 'root/components/AdminHeader/AdminHeader'
import AdminShell from 'root/components/AdminShell/AdminShell'
import AdminTitle from 'root/components/AdminTitle/AdminTitle'
import BtnMobileMenu from 'root/components/Btn/BtnMobileMenu'
import collection from 'shared/models/<%= @context_name %>/<%= @model_name %>/<%= model_name_graphql_case %>Collection.gql.ts'
import routeNames from 'root/routes/routeNames'
import schema from 'shared/models/<%= @context_name %>/<%= @model_name %>/<%= model_name_graphql_case %>.json'

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

  const modelTableProps = computed<ModelTableProps>(() => {
    return {
      headerLabels,
      rows: q.data.value?.userCollection.edges.map((edge: <%= @model_name %>Edge) => edge.node) || []
    }
  }

    const newEntryLink = {
      name: routeNames.<%= @model_name_graphql_case %>Edit,
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
        headerBtns={headerBtns}
        v-slots={{
          btns: () => <Btn
            class="s1050m:hidden"
            label="New <%= @model_name %>"
            reverse={true}
            to={newEntryLink}
          />
        }}
      >
        <AdminTitle><%= @model_name %> Management</AdminTitle>
      </AdminHeader>
      <AdminBody>
        {
          data?.<%= @model_name_graphql_case %>Collection?.count > 0 &&
            <StateEmpty class="pb-2 pt-4" icon={faEmptySet} label="No Results" />
        }
        {
          fetching.value &&
            <StateLoading class="pb-2 pt-4"/>
        }
      </AdminBody>
      <AdminFooter>
        <BtnMobileMenu
          label="New <%= @model_name %>"
          to={newEntryLink}
        />
      </AdminFooter>
    </AdminShell>
  }
})