import AdminBody from '../../components/AdminBody/AdminBody'
import AdminCard from '../../components/AdminCard/AdminCard'
import AdminFooter from "../../components/AdminFooter/AdminFooter";
import AdminHeader from "../../components/AdminHeader/AdminHeader";
import AdminList from '../../layouts/AdminList/AdminList'
import AdminShell from "../../layouts/AdminShell/AdminShell";
import Btn from "../../componentTemplates/Btn/Btn";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { defineComponent, computed } from "vue";
import { routeNames } from "../../playground/routeNames";
import { faFilter, faSortAmountDown, faTag } from '@fortawesome/free-solid-svg-icons'
import Pagination from '../../components/Pagination/Pagination'
import Pill from '../../components/Pill/Pill'
import Search from '../../components/Search/Search'
import StateEmpty from "../../components/StateEmpty/StateEmpty"
import StateLoading from "../../components/StateLoading/StateLoading"
import { FontAwesomeIcon } from "../../fontawesomeTypeFix"

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
      },
      {
        label: "Entry Type",
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

    return () => <AdminShell>
      <AdminHeader tabs={headerTabs}>
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
      </AdminHeader>
      <AdminBody>
      <div>
          <div class="flex s650m:flex-wrap mb-2">
            <Search 
              change={() => {}}
              class="mb-2"
              focusOnMount={false}
              placeholder="Search..."
              val={search}
            />
            <div class="flex-fit s650m:pr-1 s650m:w-1/2 s650:ml-2">
              <div class="bg-white border-1 border-gray-300 cursor-pointer flex items-center p-2 rounded-md  transition hover:border-blue-400">
                <FontAwesomeIcon class="mr-1 text-gray-400 text-base" icon={faSortAmountDown} />
                <span>Oldest</span>
              </div>
            </div>
            <div class="flex-fit mb-2 s650m:pl-1 s650m:w-1/2 s650:ml-2">
              <div class="bg-white border-1 border-gray-300 cursor-pointer flex items-center p-2 rounded-md  transition hover:border-blue-400">
                <FontAwesomeIcon class="mr-1 text-gray-400 text-base" icon={faFilter} />
                <span>Sort</span>
              </div>
            </div>
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
            false && <StateEmpty class="pb-2 pt-4" />
          }
          {
            false && <StateLoading class="pb-2 pt-4"/>
          }
          <AdminList>
            {[1,2,3,4].map(i => <AdminCard>Test</AdminCard>)}
          </AdminList>
          <Pagination class="py-6" />
        </div>
      </AdminBody>
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
    </AdminShell>
  }
})