import AdminFooter from "../../templates/components/AdminFooter/AdminFooter";
import Btn from "../../templates/components/Btn/Btn";
import { defineComponent, computed } from "vue";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { routeNames } from "../../playground/routeNames";

export default defineComponent({
  setup () {

    const mobileBtns = computed(() => [
      {
        click: () => {},
        icon: faArrowLeft,
        label: "Back"
      }
    ])

    return () => <div class="bg-white h-screen s1050m:pb-14">
      <AdminFooter hideMenu={true}>
        {
          mobileBtns.value.map(btn => {
            return <Btn
              class="bg-gray-700 hover:bg-gray-600 font-semibold text-gray-300 w-full"
              {...btn}
            />
          })
        }
      </AdminFooter>
    </div>
  }
})