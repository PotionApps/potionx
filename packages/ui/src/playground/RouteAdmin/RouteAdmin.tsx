import { defineComponent, computed } from "vue";
import AdminListLayout from "../../layouts/AdminListLayout/AdminListLayout";
import { routeNames } from "../../playground/routeNames";
import Bars from "../../assets/bars.svg";

export default defineComponent({
  setup () {

    const mobileBtns = computed(() => [
      {
        icon: Bars,
        label: "Back",
        to: {
          name: routeNames.login
        }
      },
      {
        label: "New Entry",
        to: {
          name: routeNames.login
        }
      }
    ])

    return () => <AdminListLayout
      adminFooterBtns={mobileBtns}
    >
      <h1 class="text-gray-800 text-2xl mb-8">admin</h1>
    </AdminListLayout>
  }
})