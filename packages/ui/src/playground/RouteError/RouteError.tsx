import AdminContent from "../../layouts/AdminContent/AdminContent";
import AdminFooter from "../../templates/components/AdminFooter/AdminFooter";
import Btn from "../../templates/components/Btn/Btn";
import BtnPrimary from "../../templates/components/Btn/BtnPrimary";
import { defineComponent, computed } from "vue";
import { faArrowLeft, faHome } from "@fortawesome/free-solid-svg-icons";
import { routeNames } from "../../playground/routeNames";

export default defineComponent({
  setup () {

    const mobileBtns = computed(() => [
      {
        click: () => {},
        icon: faArrowLeft,
        label: "Back"
      },
      {
        label: "Home",
        icon: faHome,
        to: {
          name: routeNames.home
        }
      }
    ])

    return () => <AdminContent class="bg-white flex items-center justify-center p-6 text-center">
      <div class="relative">
        <p class="absolute font-bold left-1/2 text-gray-100 top-1/2 transform -translate-x-1/2 -translate-y-1/2" style="font-size:220px;">404</p>
        <div class="relative z-2">
          <p class="font-semibold mb-4 text-gray-700 text-xl s450:text-2xl z-2">The page you are looking for doesn't exist.</p>
          <div class="flex justify-center s1050m:hidden">
            {
              mobileBtns.value.map(btn => {
                return <BtnPrimary
                  class="mx-1"
                  {...btn}
                />
              })
            }
          </div>
        </div>
      </div>
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