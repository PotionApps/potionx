import { computed, defineComponent } from 'vue'
import { routeNames } from './playground/routeNames'
import { useRoute } from 'vue-router'
import AdminAccount from 'root/components/AccountToggle/AccountToggle'
import AdminShell from 'root/components/AdminShell/AdminShell'
import AdminSidebar from 'root/components/AdminSidebar/AdminSidebar'
import Menu from 'root/components/Menu/Menu';
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
        showSidebar.value && !showMenu.value && 
        <AdminSidebar>
          <div class="flex-1">
            <router-link class="block mx-2 my-4 text-2xl text-gray-100" to={{name: routeNames.home}}>Admin</router-link>
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
        <Menu>
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
        </Menu>
      }
      {
        !showMenu.value &&
        <router-view class="flex-1" />
      }
    </AdminShell>
  }
})