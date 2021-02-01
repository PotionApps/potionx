import { AdminHeader, AdminHeaderAccount, AdminHeaderNav } from "@potionapps/ui";
import { computed, defineComponent } from 'vue'
import { useRoute } from 'vue-router'
import { routeNames } from './routes/routeNames'
import useAdminHeaderAccount from './useAdminHeaderAccount'
import useAdminHeaderNav from './useAdminHeaderNav'

export default defineComponent({
  name: 'App',
  components: {
  },
  setup () {
    const adminHeaderNavProps = useAdminHeaderNav()
    const adminHeaderAccountProps = useAdminHeaderAccount()
    const route = useRoute()

    const isLoginRoute = computed(() => {
      return [routeNames.login, routeNames.loginError].includes(route.name as any)
    })

    return () => <div class="flex flex-col justify-between min-h-screen">
      { 
        !isLoginRoute.value && <AdminHeader class="s1050m:hidden">
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