import AdminHeader from "./components/AdminHeader/AdminHeader";
import AdminHeaderAccount from "./components/AdminHeaderAccount/AdminHeaderAccount";
import AdminHeaderNav from "./components/AdminHeaderNav/AdminHeaderNav";
import { defineComponent, computed } from 'vue'
import PotionLogo from './assets/potion-logo.svg'
import { useAdminHeaderAccountNav } from "./useAdminHeaderAccountNav";
import { useAdminHeaderNav } from "./useAdminHeaderNav";
import { routeNames } from "./playground/routeNames";
import { useRoute } from "vue-router"

export default defineComponent({
  name: 'App',
  components: {},
  setup () {

    const { adminHeaderNav } = useAdminHeaderNav()
    const { adminHeaderAccountNav, adminHeaderAccountUser } = useAdminHeaderAccountNav()

    const showHeader = computed(() => {
      return useRoute().name != routeNames.login && routeNames.loginError
    })

    return () => <div class="flex flex-col justify-between min-h-screen">
      {
        showHeader.value && 
        <AdminHeader class="desktopm:hidden">
          <img class="w-4" src={PotionLogo}/>
          <AdminHeaderNav nav={adminHeaderNav.value} />
          <AdminHeaderAccount 
            btns={adminHeaderAccountNav.value}
            initials={adminHeaderAccountUser}
          />
        </AdminHeader>
      }
      <router-view class="flex-1" />
    </div>
  }
})