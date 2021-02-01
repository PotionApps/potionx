import { AdminHeader, AdminHeaderAccount, AdminHeaderNav } from "@potionapps/ui";
import { defineComponent } from 'vue'
import useAdminHeaderAccount from './useAdminHeaderAccount'
import useAdminHeaderNav from './useAdminHeaderNav'

export default defineComponent({
  name: 'App',
  components: {
  },
  setup () {

    const adminHeaderNavProps = useAdminHeaderNav()
    const adminHeaderAccountProps = useAdminHeaderAccount()

    return () => <div class="flex flex-col justify-between min-h-screen">
      { 
        <AdminHeader class="s1050m:hidden">
          <div class="font-bold text-white"><%= @app_name %></div>
          <AdminHeaderNav {...adminHeaderNavProps.value} />
          <AdminHeaderAccount 
            {...adminHeaderAccountProps}
          />
        </AdminHeader>
      }
      <router-view />
    </div>
  }
})