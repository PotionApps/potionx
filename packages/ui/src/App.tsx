import { defineComponent, computed, ref } from 'vue'
import { useAdminNavPrimary } from "./useAdminNavPrimary";
import { useAdminNavSecondary } from "./useAdminNavSecondary";
import { routeNames } from "./playground/routeNames";
import { useRoute } from "vue-router"
import AdminSidebar from "./components/AdminSidebar/AdminSidebar";
import PotionLogo from './assets/potion-logo.svg'
import SidebarNavItem from './templates/themes/admin/src/components/SidebarNavItem/SidebarNavItem';
import * as Stories from './stories'

export default defineComponent({
  name: 'App',
  components: {},
  setup () {
    const { adminNavPrimary } = useAdminNavPrimary()
    const { adminNavSecondary } = useAdminNavSecondary()

    const showSidebar = computed(() => {
      return useRoute().name != routeNames.login && routeNames.loginError
    })

    const showMenu = ref(false)

    return () => <div class="flex min-h-screen max-w-screen overflow-x-hidden">
      {
        showMenu.value &&
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
        <AdminSidebar
          class="s1050m:hidden relative z-1"
        >
          <div class="flex items-center mb-6">
            <img class="mr-2 w-4" src={PotionLogo}/>
            <p class="text-2xl text-gray-100">Potion</p>
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
      <button
        class="bg-black fixed bottom-0 mb-4 mr-4 px-4 py-1 right-0 rounded-full text-white"
        onClick={() => showMenu.value = !showMenu.value}
      >Menu</button>
    </div>
  }
})