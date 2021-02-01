import { PropsAdminHeaderAccount } from "./components/AdminHeaderAccount/AdminHeaderAccount";
import { computed } from 'vue'
import { routeNames } from "./playground/routeNames";

export const useAdminHeaderAccountNav = () => {
 
  const adminHeaderAccountNav = computed<PropsAdminHeaderAccount['btns']>(() => {
    return [
      {
        label: "Account",
        to: {
          name: routeNames.login
        }
      },
      {
        click: () => {},
        label: "Log Out",
        hey: 1
      }
    ]
  })

  const adminHeaderAccountUser = "MD"

  return { adminHeaderAccountNav, adminHeaderAccountUser }
}