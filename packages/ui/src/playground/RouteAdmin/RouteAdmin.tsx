import AdminCard from '../../components/AdminCard/AdminCard'
import AdminContent from "../../layouts/AdminContent/AdminContent";
import AdminFooter from "../../components/AdminFooter/AdminFooter";
import AdminList from '../../components/AdminList/AdminList'
import Btn from "../../templates/components/Btn/Btn";
import Dropdown from '../../templates/components/Dropdown/Dropdown'
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { defineComponent, computed } from "vue";
import { routeNames } from "../../playground/routeNames";
import { faFilter, faSortAmountDown, faTag, faUsers } from '@fortawesome/free-solid-svg-icons'
import Pagination from '../../templates/components/Pagination/Pagination'
import Pill from '../../templates/components/Pill/Pill'
import Search from '../../templates/components/Search/Search'
import StateEmpty from "../../templates/components/StateEmpty/StateEmpty"
import StateLoading from "../../templates/components/StateLoading/StateLoading"
import Tabs from '../../templates/components/Tabs/Tabs'
import Wrapper from '../../templates/components/Wrapper/Wrapper'

export default defineComponent({
  setup () {
    const headerBtns = computed(() => [
      {
        hideBtnMobile: true,
        icon: faArrowRight,
        label: "Compose",
        reverse: true,
        to: {
          name: routeNames.menu
        }
      }
    ])

    const headerTabs = computed(() => [
      {
        label: "Categories",
        to: {
          name: routeNames.admin
        }
      },
      {
        icon: faArrowLeft,
        label: "Entries",
        to: {
          name: routeNames.menu
        }
      }
    ])

    const mobileBtns = computed(() => [
      {
        click: () => {},
        icon: faArrowLeft,
        label: "Back"
      },
      {
        label: "New Entry",
        to: {
          name: routeNames.login
        }
      }
    ])

    const search = computed(() => {
      return ""
    })

    return () => <AdminContent>
      <Wrapper class="bg-white border-b-1 border-gray-300 pt-4">
        <div class="flex items-center justify-between pr-4 s1050m:flex-wrap s1050:pr-0">
          <div class="flex flex-full items-center mb-2">
            <div class="s1050:max-w-500 s1450:max-w-600">
              <p class="font-semibold text-gray-900 text-xl">Some Article Title</p>
              <span class="text-gray-600 text-sm">Post - 5 days ago</span>
            </div>
          </div>
          {headerBtns.value.map(btn => {
            return <Btn
              {...btn}
              class={["bg-gray-200 mb-2 p-2 rounded text-gray-900 text-xs s1050m:mr-2 s1050:ml-2", btn.hideBtnMobile && "s1050m:hidden"]}
          />})}
        </div>
        <Tabs tabs={headerTabs} />
      </Wrapper>
      <Wrapper class="py-6">
        <div class="flex s650m:flex-wrap mb-2">
          <Search 
            change={() => {}}
            class="mb-2"
            focusOnMount={false}
            placeholder="Search..."
            val={search}
          />
          <Dropdown 
            class="flex-fit mb-2 s650m:pr-1 s650m:w-1/2 s650:ml-2"
            icon={faSortAmountDown}
            label="Oldest"
          />
          <Dropdown 
            class="flex-fit mb-2 s650m:pl-1 s650m:w-1/2 s650:ml-2"
            icon={faFilter}
            label="Sort"
          />
        </div>
        <div class="flex">
          <Pill 
            class="mb-2 mr-2"
            icon={faTag}
            label="Category"
            remove={() => {}}
          />
        </div>
        {
          true && <StateEmpty class="pb-2 pt-4" icon={faUsers} label="No Users Found" />
        }
        {
          true && <StateLoading class="pb-2 pt-4"/>
        }
        <AdminList>
          {[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17].map(i => <AdminCard>Test</AdminCard>)}
        </AdminList>
        <Pagination class="py-6" />
      </Wrapper>
      <AdminFooter menuRoute={{name: routeNames.menu}}>
        {
          mobileBtns.value.map(btn => {
            return <Btn
              class="bg-gray-700 hover:bg-gray-600 mr-2 font-semibold text-gray-300 w-full"
              {...btn}
            />
          })
        }
      </AdminFooter>
    </AdminContent>
  }
})