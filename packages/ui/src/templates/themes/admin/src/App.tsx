import { computed, defineComponent } from 'vue'
import { routeNames } from './routes/routeNames'
import { useRoute } from 'vue-router'
import AdminAccount from 'root/components/AdminAccount/AdminAccount'
import AdminShell from 'root/components/AdminShell/AdminShell'
import AdminSidebar from 'root/components/AdminSidebar/AdminSidebar'
import RouteMenu from './routes/RouteMenu/RouteMenu';
import SidebarNavItem from 'root/components/SidebarNavItem/SidebarNavItem'
import useAdminNavPrimary from "./useAdminNavPrimary";
import useAdminNavSecondary from "./useAdminNavSecondary";

export default defineComponent({
  name: 'App',
  setup () {
    const adminNavPrimary = useAdminNavPrimary()
    const adminNavSecondary = useAdminNavSecondary()
    const route = useRoute()

    const showSidebar = computed(() => {
      return route.name != routeNames.login && routeNames.loginError
    })

    const showMenu = computed(() => {
      return route.query.menu === "1"
    })

    return () => <AdminShell>
      {
        showSidebar.value && 
        <AdminSidebar>
          <div class="flex-1">
            <p class="my-4 mx-2 text-2xl text-gray-100">Admin</p>
            <nav>
              {
                adminNavPrimary.value.map(nav => {
                  return <SidebarNavItem {...nav} />
                })
              }
            </nav>
          </div>
          <AdminAccount
            name="User Name"
            nav={adminNavSecondary}
          />
        </AdminSidebar>
      }
      {
        showMenu.value &&
        <RouteMenu class="flex-1" />
      }
      {
        !showMenu.value &&
        <router-view class="flex-1" />
      }
    </AdminShell>
  }
})