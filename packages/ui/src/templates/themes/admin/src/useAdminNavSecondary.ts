import { computed } from 'vue'
import { routeNames } from './routes/routeNames'
import { SidebarNavItemProps } from './components/SidebarNavItem/SidebarNavItem'
import signOut from 'shared/signOut'

export const useAdminNavSecondary = () => {
  return computed(() => {
    return ([
      {
        label: "Account",
        to: {
          name: routeNames.login
        }
      },
      {
        click: signOut,
        label: "Log Out"
      }
    ])
  })
}