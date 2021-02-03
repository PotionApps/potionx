import AdminCard from '../../components/AdminCard/AdminCard'
import AdminListLayout from '../../layouts/AdminListLayout/AdminListLayout'
import AdminLayout from "../../layouts/AdminLayout/AdminLayout";
import Bars from "../../assets/bars.svg";
import Back from "../../assets/back.svg";
import { defineComponent, computed } from "vue";
import { routeNames } from "../../playground/routeNames";

export default defineComponent({
  setup () {

    const subHeaderBtns = computed(() => [
      {
        label: "Publish",
        to: {
          name: routeNames.menu
        }
      },
      {
        image: Back,
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
      }
    ])

    const subHeaderTabs = computed(() => [
      {
        label: "Categories",
        to: {
          name: routeNames.menu
        }
      },
      {
        image: Back,
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
      },
      {
        label: "Categories",
        to: {
          name: routeNames.admin
        }
      }
    ])

    const mobileBtns = computed(() => [
      {
        click: () => {},
        image: Bars,
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

    return () => <AdminLayout
      class="bg-gray-200"
      adminFooterBtns={mobileBtns}
      adminFooterMenuRoute={{name: routeNames.menu}}
      adminSubHeaderBack={() => {}}
      adminSubHeaderBtns={subHeaderBtns}
      adminSubHeaderHideBtnsMobile={false}
      adminSubHeaderSubtitle="Post - 5 days"
      adminSubHeaderTabs={subHeaderTabs}
      adminSubHeaderTitle="Some Article Title"
    >
      <AdminListLayout searchValue={search}>
          <AdminCard>
            Test
          </AdminCard>
          <AdminCard>
            Test
          </AdminCard>
          <AdminCard>
            Test
          </AdminCard>
      </AdminListLayout>
    </AdminLayout>
  }
})