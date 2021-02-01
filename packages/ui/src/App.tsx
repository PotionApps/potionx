import AdminHeader from "./components/AdminHeader/AdminHeader";
import AdminHeaderAccount from "./components/AdminHeaderAccount/AdminHeaderAccount";
import AdminHeaderNav from "./components/AdminHeaderNav/AdminHeaderNav";
import { defineComponent } from 'vue'
import PotionLogo from './assets/potion-logo.svg'
import { useAdminHeaderAccountNav } from "./useAdminHeaderAccountNav";
import { useAdminHeaderNav } from "./useAdminHeaderNav";

export default defineComponent({
  name: 'App',
  components: {
  },
  setup () {

    const { adminHeaderNav } = useAdminHeaderNav()
    const { adminHeaderAccountNav, adminHeaderAccountUser } = useAdminHeaderAccountNav()

    return () => <div class="flex flex-col justify-between min-h-screen">
      <AdminHeader class="s1050m:hidden">
        <img class="w-4" src={PotionLogo}/>
        <AdminHeaderNav nav={adminHeaderNav} />
        <AdminHeaderAccount 
          btns={adminHeaderAccountNav.value}
          initials={adminHeaderAccountUser}
        />
      </AdminHeader>
      <router-view class="flex-1" />
    </div>
  }
})