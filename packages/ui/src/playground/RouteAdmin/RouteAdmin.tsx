import AdminCard from '../../components/AdminCard/AdminCard'
import AdminFooter from "../../components/AdminFooter/AdminFooter";
import AdminHeader from "../../components/AdminHeader/AdminHeader";
import AdminList from '../../layouts/AdminList/AdminList'
import AdminShell from "../../layouts/AdminShell/AdminShell";
import Btn from "../../componentTemplates/Btn/Btn";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { defineComponent, computed } from "vue";
import { routeNames } from "../../playground/routeNames";

export default defineComponent({
  setup () {

    const HeaderBtns = computed(() => [
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

    const HeaderTabs = computed(() => [
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
      <AdminHeader>
        <div class="flex items-center justify-between pr-4 s1050m:flex-wrap s1050:pr-0">
          <div class="flex flex-full items-center mb-2">
            <div class="s1050:max-w-500 s1450:max-w-600">
              <p class="font-semibold text-gray-900 text-xl">Some Article Title</p>
              <span class="text-gray-600 text-sm">Post - 5 days ago</span>
            </div>
          </div>
          {HeaderBtns.value.map(btn => {
            return <Btn
              {...btn}
              class={["bg-gray-200 mb-2 p-2 rounded text-gray-900 text-xs s1050m:mr-2 s1050:ml-2", btn.hideBtnMobile && "s1050m:hidden"]}
          />})}
        </div>
      </AdminHeader>
      <AdminList searchValue={search}>
        {[1,2,3,4].map(i => <AdminCard>Test</AdminCard>)}
      </AdminList>
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