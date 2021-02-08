import { AdminNav } from "@potionapps/ui";
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

    return () => <div class="flex flex-col min-h-screen">
      { 
        !isLoginRoute.value &&
        <AdminSidebar
          class="s1050m:hidden relative z-1"
          v-slots={{
            nav: () => {
              return <>
                <AdminNav nav={adminNavModules.value} />
                <AdminNav nav={adminNavAccount.value} />
              </>
            }
          }}
        >
          <div class="flex items-center mb-6">
            <img class="mr-2 w-4" src={PotionLogo}/>
            <p class="text-2xl text-gray-100">Potion</p>
          </div>
        </AdminSidebar>
      }
      <router-view class="flex-1" />
    </div>
  }
})