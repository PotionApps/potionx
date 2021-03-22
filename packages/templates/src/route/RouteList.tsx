import { computed, defineComponent } from "vue"
import { RootQueryType } from "shared/types";
import { routeNames } from 'root/routes/routeNames'
import { useQuery } from "@urql/vue";
import { useRouter } from "vue-router";
import AdminFooter from 'components/AdminFooter/AdminFooter'
import AdminHeader from 'components/AdminHeader/AdminHeader'
import AdminHeaderBtnWrap from "components/AdminHeaderBtnWrap/AdminHeaderBtnWrap";
import AdminMain from "components/AdminMain/AdminMain";
import AdminHeaderTitle from 'components/AdminHeaderTitle/AdminHeaderTitle'
import BtnMobileMenu from 'components/Btn/BtnMobileMenu'
import BtnSmallPrimary from "components/Btn/BtnSmallPrimary";
import collection from 'shared/models/__context__/__model__/__model_graphql_case__Collection.gql'
import ModelTable, { ModelTableProps } from 'components/ModelTable/ModelTable'
import Pagination from "components/Pagination/Pagination";
import schema from 'shared/models/__context__/__model__/__model_graphql_case__.json'
import StateEmpty from 'components/StateEmpty/StateEmpty'
import StateLoading from 'components/StateLoading/StateLoading'
import usePagination from "root/hooks/usePagination";

export default defineComponent({
  setup () {
    const headingLabels =
      schema.map((s: any) => ({
        key: s.name,
        label: s.label || s.name
      }))
    const limit = 100

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
        rows:
          data.value?.__model_graphql_case__Collection?.edges?.map((edge) => edge!.node!)
            .filter(n => n)
      }
    })

    const newEntryLink = {
      name: routeNames.__model_graphql_case__Edit,
      params: {
        id: 'new'
      }
    }

    const pageInfo = computed(() => {
      return data.value?.__model_graphql_case__Collection?.pageInfo
    })
    const router = useRouter()

    const {
      goToFirst,
      goToLast,
      next, 
      prev,
      variables
    } = usePagination({
      limit,
      pageInfo,
      routeMode: false
    })

    const { data, fetching, error } = useQuery<RootQueryType>({
      query: collection,
      requestPolicy: 'cache-and-network',
      variables: computed(() => {
        return variables.value
      })
    })

    return () => {
      return <AdminMain>
        <AdminHeader
          v-slots={{
            btns: () => 
            <AdminHeaderBtnWrap>
              <BtnSmallPrimary
                label="New __model__"
                reverse={true}
                to={newEntryLink}
              />
            </AdminHeaderBtnWrap>
          }}
        >
          <AdminHeaderTitle>__model__ Management</AdminHeaderTitle>
        </AdminHeader>
        <div>
          {
            (error.value || data.value?.__model_graphql_case__Collection?.count! === 0) &&
              <StateEmpty class="pb-2 pt-4" label="No Results" />
          }
          {
            fetching.value && !data.value &&
              <StateLoading class="pb-2 pt-4"/>
          }
          {
            !!data.value?.__model_graphql_case__Collection?.edges?.length &&
            <ModelTable {...modelTableProps.value} />
          }
        </div>
        {
          pageInfo.value && !!data.value?.__model_graphql_case__Collection?.count &&
          <Pagination
            count={data.value?.__model_graphql_case__Collection?.count}
            countBefore={data.value?.__model_graphql_case__Collection?.countBefore}
            goToFirst={goToFirst}
            goToLast={goToLast}
            limit={limit}
            next={next}
            prev={prev}
          />
        }
        <AdminFooter>
          <BtnMobileMenu
            label="New __model__"
            to={newEntryLink}
          />
        </AdminFooter>
    </AdminMain>
  }}
})