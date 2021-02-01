import AdminHeader from "./components/AdminHeader/AdminHeader";
import AdminHeaderAccount from "./components/AdminHeaderAccount/AdminHeaderAccount";
import AdminHeaderNav from "./components/AdminHeaderNav/AdminHeaderNav";
import { defineComponent } from 'vue'
import PotionLogo from './assets/potion-logo.svg'
import { useAdminHeaderAccountNav } from "./useAdminHeaderAccountNav";
import { useAdminHeaderNav } from "./useAdminHeaderNav";

export default defineComponent({
  name: 'App',
  components: {},
  setup () {

    const { adminHeaderNav } = useAdminHeaderNav()
    const { adminHeaderAccountNav, adminHeaderAccountUser } = useAdminHeaderAccountNav()

    return () => <div class="flex flex-col justify-between min-h-screen">
      <AdminHeader class="s1050m:hidden">
        <div class="font-bold text-white">Potion</div>
        <AdminHeaderNav nav={adminHeaderNav.value} />
        <AdminHeaderAccount 
          btns={adminHeaderAccountNav.value}
          initials={adminHeaderAccountUser}
        />
      </AdminHeader>
      <router-view />
    </div>
  }
})