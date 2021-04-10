import { computed, defineComponent } from 'vue'
import { routeNames } from './routes/routeNames'
import { useRoute } from 'vue-router'
import AdminShell from 'components/AdminShell/AdminShell'
import AdminSidebar from 'components/AdminSidebar/AdminSidebar'
import Menu from 'components/Menu/Menu';
import SidebarNavItem from 'components/SidebarNavItem/SidebarNavItem'
import useAdminNavPrimary from "./useAdminNavPrimary";
import useAdminNavSecondary from "./useAdminNavSecondary";

export default defineComponent({
  name: 'App',
  setup () {
    const adminNavPrimary = useAdminNavPrimary()
    const adminNavSecondary = useAdminNavSecondary()
    const route = useRoute()

    const showMenu = computed(() => {
      return route.query?.menu === "1"
    })

    const showSidebar = computed(() => {
      return route.name != routeNames.login && routeNames.loginError
    })

    return () => <AdminShell>
      {
        showSidebar.value && !showMenu.value && 
        <AdminSidebar>
          <div class="flex-1">
            <router-link class="block mx-4 my-4 text-2xl text-gray-100" to={{name: routeNames.home}}>Admin</router-link>
            <nav>
              {
                adminNavPrimary.value.map(nav => {
                  return <SidebarNavItem {...nav} key={nav.label} />
                })
              }
            </nav>
          </div>
          <nav>
            {
              adminNavSecondary.value.map(nav => {
                return <SidebarNavItem {...nav} key={nav.label} />
              })
            }
          </nav>
        </AdminSidebar>
      }
      {
        showMenu.value &&
        <Menu>
          <nav>
            {
              adminNavPrimary.value.map(nav => {
                return <SidebarNavItem {...nav} key={nav.label} />
              })
            }
            {
              adminNavSecondary.value.map(nav => {
                return <SidebarNavItem {...nav} key={nav.label} />
              })
            }
          </nav>
        </Menu>
      }
      {
        !showMenu.value &&
        <router-view class="flex-1" />
      }
    </AdminShell>
  }
})