import { computed } from 'vue'
import { routeNames } from './routes/routeNames'
import { SidebarNavItemProps } from '@potionapps/ui'
import signOut from 'shared/signOut'

export const useAdminNavSecondary = () => {
  return computed<SidebarNavItemProps[]>(() => {
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