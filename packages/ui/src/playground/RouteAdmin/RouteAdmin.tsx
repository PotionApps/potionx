import { defineComponent, computed } from "vue";
import AdminListLayout from "../../layouts/AdminLayout/AdminLayout";
import { routeNames } from "../../playground/routeNames";
import Bars from "../../assets/bars.svg";
import Back from "../../assets/back.svg"

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
        icon: Back,
        label: "In progress",
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

    return () => <AdminListLayout
      class="bg-gray-200"
      adminFooterBtns={mobileBtns}
      adminFooterMenuRoute={{name: routeNames.menu}}
      adminSubHeaderBack={() => {}}
      adminSubHeaderBtns={subHeaderBtns}
      adminSubHeaderSubtitle="Post - 5 days"
      adminSubHeaderTabs={subHeaderTabs}
      adminSubHeaderTitle="Some Article Title"
    >
      <div class="p-4">
        <h1 class="text-gray-800 text-2xl mb-8">admin</h1>
      </div>
    </AdminListLayout>
  }
})