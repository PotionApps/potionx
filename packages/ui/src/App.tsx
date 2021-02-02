import AdminHeader from "./components/AdminHeader/AdminHeader";
import AdminHeaderAccount from "./components/AdminHeaderAccount/AdminHeaderAccount";
import AdminHeaderNav from "./components/AdminHeaderNav/AdminHeaderNav";
import { defineComponent, computed, ref } from 'vue'
import PotionLogo from './assets/potion-logo.svg'
import { useAdminHeaderAccountNav } from "./useAdminHeaderAccountNav";
import { useAdminHeaderNav } from "./useAdminHeaderNav";
import { routeNames } from "./playground/routeNames";
import { useRoute } from "vue-router"
import * as Stories from './stories'


export default defineComponent({
  name: 'App',
  components: {},
  setup () {
    const { adminHeaderNav } = useAdminHeaderNav()
    const { adminHeaderAccountNav, adminHeaderAccountUser } = useAdminHeaderAccountNav()

    const showHeader = computed(() => {
      return useRoute().name != routeNames.login && routeNames.loginError
    })

    const showMenu = ref(false)

    return () => <div class="flex flex-col justify-between min-h-screen">
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
        showHeader.value && 
        <AdminHeader class="desktopm:hidden relative z-1">
          <img class="w-4" src={PotionLogo}/>
          <AdminHeaderNav nav={adminHeaderNav.value} />
          <AdminHeaderAccount 
            btns={adminHeaderAccountNav.value}
            initials={adminHeaderAccountUser}
          />
        </AdminHeader>
      }
      <router-view class="flex-1" />
      <button
        class="bg-black fixed bottom-0 mb-4 mr-4 px-4 py-1 right-0 rounded-full text-white"
        onClick={() => showMenu.value = !showMenu.value}
      >Menu</button>
    </div>
  }
})