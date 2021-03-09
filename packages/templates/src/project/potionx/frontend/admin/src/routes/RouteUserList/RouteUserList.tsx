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
import BtnPrimary from "components/Btn/BtnPrimary";
import collection from 'shared/models/Users/User/userCollection.gql'
import ModelTable, { ModelTableProps } from 'components/ModelTable/ModelTable'
import Pagination from "components/Pagination/Pagination";
import schema from 'shared/models/Users/User/user.json'
import StateEmpty from 'components/StateEmpty/StateEmpty'
import StateLoading from 'components/StateLoading/StateLoading'
import usePagination from "hooks/usePagination";

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
            name: routeNames.userEdit,
            params: {
              id: row.id!
            }
          })
        },
        headingLabels,
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
              <BtnPrimary
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
        <AdminFooter>
          <BtnMobileMenu
            label="New User"
            to={newEntryLink}
          />
        </AdminFooter>
    </AdminMain>
  }}
})