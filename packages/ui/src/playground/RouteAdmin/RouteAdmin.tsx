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
      <AdminHeader 
        back={() => {}}
        btns={HeaderBtns}
        subtitle="Post - 5 days"
        tabs={HeaderTabs}
        title="Some Article Title that is longer than a usual title"
      />
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