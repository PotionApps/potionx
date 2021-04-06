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
import collection from 'shared/models/Users/User/userCollection.gql'
import ModelTable, { ModelTableProps } from 'components/ModelTable/ModelTable'
import Pagination from "components/Pagination/Pagination";
import StateEmpty from 'components/StateEmpty/StateEmpty'
import StateLoading from 'components/StateLoading/StateLoading'
import useModelIntrospection from "root/hooks/useModelIntrospection";
import usePagination from "root/hooks/usePagination";
import useQueryArgs from "root/hooks/useQueryArgs";

export default defineComponent({
  setup () {
    const { fields } = useModelIntrospection('User')
    const limit = 100

    const modelTableProps = computed<ModelTableProps>(() => {
      return {
        checkboxClick: (row) => {
          router.push({
            name: routeNames.userEdit,
            params: {
              id: row.id!
            }
          })
        },
        headingLabels: fields.value,
        rows:
          data.value?.userCollection?.edges?.map((edge) => edge!.node!)
            .filter(n => n)
      }
    })

    const newEntryLink = {
      name: routeNames.userEdit,
      params: {
        id: 'new'
      }
    }

    const pageInfo = computed(() => {
      return data.value?.userCollection?.pageInfo
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
                label="New User"
                reverse={true}
                to={newEntryLink}
              />
            </AdminHeaderBtnWrap>
          }}
        >
          <AdminHeaderTitle>User Management</AdminHeaderTitle>
        </AdminHeader>
        <div>
          {
            (error.value || data.value?.userCollection?.count! === 0) &&
              <StateEmpty class="pb-2 pt-4" label="No Results" />
          }
          {
            fetching.value && !data.value &&
              <StateLoading class="pb-2 pt-4"/>
          }
          {
            !!data.value?.userCollection?.edges?.length &&
            <ModelTable {...modelTableProps.value} />
          }
        </div>
        {
          pageInfo.value && data.value?.userCollection?.count &&
          <Pagination
            count={data.value?.userCollection?.count}
            countBefore={data.value?.userCollection?.countBefore}
            goToFirst={goToFirst}
            goToLast={goToLast}
            limit={limit}
            next={next}
            prev={prev}
          />
        }
        <AdminFooter class="s1050:hidden">
          <BtnMobileMenu
            label="New User"
            to={newEntryLink}
          />
        </AdminFooter>
    </AdminMain>
  }}
})