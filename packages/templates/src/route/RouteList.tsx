import { computed, defineComponent } from "vue"
import { RootQueryType } from "shared/types";
import { routeNames } from 'root/routes/routeNames'
import { useQuery } from "@urql/vue";
import { useRouter } from "vue-router";
import AdminCollectionWrap from 'components/AdminCollectionWrap/AdminCollectionWrap'
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
import StateEmpty from 'components/StateEmpty/StateEmpty'
import StateLoading from 'components/StateLoading/StateLoading'
import useModelIntrospection from "root/hooks/useModelIntrospection";
import usePagination from "root/hooks/usePagination";
import useQueryArgs from "root/hooks/useQueryArgs";

export default defineComponent({
  setup () {
    const { fields } = useModelIntrospection('__model__')
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
        headingLabels: fields.value,
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
      updateQueryArgs,
      variables
    } = useQueryArgs({ routeMode: true })

    const {
      goToFirst,
      goToLast,
      next, 
      prev
    } = usePagination({
      limit,
      pageInfo,
      updateQueryArgs
    })

    const { data, fetching, error } = useQuery<RootQueryType>({
      query: collection,
      requestPolicy: 'cache-and-network',
      variables
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
        <AdminCollectionWrap>
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
        </AdminCollectionWrap>
        <AdminFooter class="s1050:hidden">
          <BtnMobileMenu
            label="New __model__"
            to={newEntryLink}
          />
        </AdminFooter>
    </AdminMain>
  }}
})