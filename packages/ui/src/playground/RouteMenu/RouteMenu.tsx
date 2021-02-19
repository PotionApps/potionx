import AdminFooter from "../../templates/components/AdminFooter/AdminFooter";
import Btn from "../../templates/components/Btn/Btn";
import { defineComponent, computed } from "vue";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { routeNames } from "../../playground/routeNames";
import SidebarNavItem from '../../templates/components/SidebarNavItem/SidebarNavItem';
import { useAdminNavPrimary } from "../../useAdminNavPrimary";
import { useAdminNavSecondary } from "../../useAdminNavSecondary";
import { useRouter } from "vue-router"

export default defineComponent({
  setup () {

    const { adminNavPrimary } = useAdminNavPrimary()
    const { adminNavSecondary } = useAdminNavSecondary()

    const router = useRouter()

    const mobileBtns = computed(() => [
      {
        click: () => router.back(),
        icon: faArrowLeft,
        label: "Back"
      }
    ])

    return () => <div class="bg-gray-800 min-h-screen s1050m:pb-14">
      <nav>
        {
          adminNavPrimary.value.map(nav => {
            return <SidebarNavItem {...nav} />
          })
        }
        {
          adminNavSecondary.value.map(nav => {
            return <SidebarNavItem {...nav} />
          })
        }
      </nav>
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