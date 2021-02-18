import { computed } from 'vue'
import { routeNames } from './routes/routeNames'
import signOut from 'shared/signOut'

export const useAdminNavSecondary = () => {
  return computed(() => {
    return ([
      {
        click: signOut,
        label: "Log Out"
      }
    ])
  })
}