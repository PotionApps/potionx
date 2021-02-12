import { computed, defineComponent } from 'vue'
import { useAdminNavPrimary } from "./useAdminNavPrimary";
import { useAdminNavSecondary } from "./useAdminNavSecondary";
import { useRoute } from 'vue-router'
import { routeNames } from './routes/routeNames'
import AdminSidebar from './components/AdminSidebar/AdminSidebar'
import SidebarNavItem from './components/SidebarNavItem/SidebarNavItem'

export default defineComponent({
  name: 'App',
  components: {
  },
  setup () {
    const adminNavPrimary = useAdminNavPrimary()
    const adminNavSecondary = useAdminNavSecondary()

    const showSidebar = computed(() => {
      return useRoute().name != routeNames.login && routeNames.loginError
    })

    return () => <div class="flex min-h-screen max-w-screen overflow-x-hidden">
      {
        showSidebar.value && 
        <AdminSidebar
          class="s1050m:hidden relative z-1"
        >
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
      <router-view class="flex-1" />
    </div>
  }
})