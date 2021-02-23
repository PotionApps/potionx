import AccountToggle from "./templates/components/AccountToggle/AccountToggle";
import AdminShell from "./templates/components/AdminShell/AdminShell";
import AdminSidebar from "./templates/components/AdminSidebar/AdminSidebar";
import { defineComponent, computed, ref } from 'vue'
import { useAdminNavPrimary } from "./useAdminNavPrimary";
import { useAdminNavSecondary } from "./useAdminNavSecondary";
import { routeNames } from "./playground/routeNames";
import { useRoute } from "vue-router"
import Menu from './templates/components/Menu/Menu';
import SidebarNavItem from './templates/components/SidebarNavItem/SidebarNavItem';
import * as Stories from './stories'
import Musk from './assets/Musk.png';

export default defineComponent({
  name: 'App',
  components: {},
  setup () {
    const { adminNavPrimary } = useAdminNavPrimary()
    const { adminNavSecondary } = useAdminNavSecondary()

    const route = useRoute()

    const showModelMenu = ref(false)

    const showSidebar = computed(() => {
      return route.name != routeNames.login && routeNames.loginError
    })

    const showMenu = computed(() => {
      return route.query.menu === "1"
    })


    return () => <AdminShell>
      {
        showModelMenu.value &&
        <div class="bg-white fixed inset-y-0 left-0 py-4 shadow-2xl w-64 z-2">
          {
            Object.keys(Stories).map(k => {
              return <router-link class="block px-6 py-1" to={"/components/" + k}>{k}</router-link>
            })
          }
        </div>
      }
      {
        showSidebar.value && 
        <AdminSidebar>
          <div class="flex-1">
            <p class="my-4 mx-2 text-2xl text-gray-100">Potion</p>
            <nav>
              {
                adminNavPrimary.value.map(nav => {
                  return <SidebarNavItem {...nav} />
                })
              }
            </nav>
          </div>
          <AccountToggle
            image={Musk}
            name="Elon Musk"
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
      <button
        class="bg-black fixed bottom-0 mb-4 mr-4 px-4 py-1 right-0 rounded-full text-white"
        onClick={() => showModelMenu.value = !showModelMenu.value}
      >Menu</button>
    </AdminShell>
  }
})