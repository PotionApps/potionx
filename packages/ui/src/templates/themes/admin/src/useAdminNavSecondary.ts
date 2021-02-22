import { computed } from 'vue'
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