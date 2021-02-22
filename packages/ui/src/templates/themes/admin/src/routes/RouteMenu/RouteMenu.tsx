import { defineComponent, computed } from "vue";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "vue-router"
import AdminFooter from "root/components/AdminFooter/AdminFooter";
import BtnMobileMenu from "root/components/Btn/BtnMobileMenu";
import SidebarNavItem from 'root/components/SidebarNavItem/SidebarNavItem';
import useAdminNavPrimary from "../../useAdminNavPrimary";
import useAdminNavSecondary from "../../useAdminNavSecondary";

export default defineComponent({
  setup () {
    const adminNavPrimary = useAdminNavPrimary()
    const adminNavSecondary = useAdminNavSecondary()
    const router = useRouter()

    const mobileBtns = computed(() => [
      {
        click:() => {
          const query: any = {...router.currentRoute.value.query}
          delete query.menu
          router.replace({
            query
          })
        },
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
            return <BtnMobileMenu {...btn} />
          })
        }
      </AdminFooter>
    </div>
  }
})