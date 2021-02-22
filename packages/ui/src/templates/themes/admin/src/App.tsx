import { computed, defineComponent } from 'vue'
import { useAdminNavPrimary } from "./useAdminNavPrimary";
import { useAdminNavSecondary } from "./useAdminNavSecondary";
import { useRoute, useRouter } from 'vue-router'
import { routeNames } from './routes/routeNames'
import AdminSidebar from 'root/components/AdminSidebar/AdminSidebar'
import SidebarNavItem from 'root/components/SidebarNavItem/SidebarNavItem'
import RouteMenu from './routes/RouteMenu/RouteMenu';

export default defineComponent({
  name: 'App',
  components: {
  },
  setup () {
    const adminNavPrimary = useAdminNavPrimary()
    const adminNavSecondary = useAdminNavSecondary()
    const route = useRoute()
    const router = useRouter()

    const showSidebar = computed(() => {
      return route.name != routeNames.login && routeNames.loginError
    })

    const showMenu = computed(() => {
      return route.query.menu === "1"
    })

    return () => <div class="flex min-h-screen max-w-screen overflow-x-hidden">
      {
        showSidebar.value && 
        <AdminSidebar>
          <div class="flex items-center mb-6">
            <p class="text-2xl text-gray-100">Admin</p>
          </div>
          <div class="flex flex-1 flex-col justify-between">
            <nav>
              {
                adminNavPrimary.value.map(nav => {
                  return <SidebarNavItem class="mb-2" {...nav} />
                })
              }
            </nav>
            <nav>
              {
                adminNavSecondary.value.map(nav => {
                  return <SidebarNavItem class="mb-2" {...nav} />
                })
              }
            </nav>
          </div>
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
    </div>
  }
})