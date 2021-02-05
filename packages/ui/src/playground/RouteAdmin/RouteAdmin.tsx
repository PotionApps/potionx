import AdminCard from '../../components/AdminCard/AdminCard'
import AdminList from '../../layouts/AdminList/AdminList'
import AdminShell from "../../layouts/AdminShell/AdminShell";
import Bars from "../../assets/bars.svg";
import Back from "../../assets/back.svg";
import { defineComponent, computed } from "vue";
import { routeNames } from "../../playground/routeNames";

export default defineComponent({
  setup () {

    const HeaderBtns = computed(() => [
      {
        label: "Publish",
        to: {
          name: routeNames.menu
        }
      },
      {
        icon: Back,
        label: "Delete",
        to: {
          name: routeNames.menu
        }
      },
      {
        label: "Compose",
        to: {
          name: routeNames.menu
        }
      },
      {
        label: "Some button",
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
        icon: Back,
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
        icon: Bars,
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

    return () => <AdminShell
      class="bg-gray-200"
      adminFooterBtns={mobileBtns}
      adminFooterMenuRoute={{name: routeNames.menu}}
      adminHeaderBack={() => {}}
      adminHeaderBtns={HeaderBtns}
      adminHeaderHideBtnsMobile={false}
      adminHeaderSubtitle="Post - 5 days"
      adminHeaderTabs={HeaderTabs}
      adminHeaderTitle="Some Article Title that is longer than a usual title"
    >
      <AdminList searchValue={search}>
          <AdminCard>
            Test
          </AdminCard>
          <AdminCard>
            Test
          </AdminCard>
          <AdminCard>
            Test
          </AdminCard>
      </AdminList>
    </AdminShell>
  }
})