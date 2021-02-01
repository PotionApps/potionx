import { PropsAdminHeaderAccountBtns } from "./components/AdminHeaderAccount/AdminHeaderAccount";
import { computed } from 'vue'
import { routeNames } from "./playground/routeNames";

export const useAdminHeaderAccountNav = () => {
 
  const adminHeaderAccountNav = computed<PropsAdminHeaderAccountBtns[]>(() => {
    return ([
      {
        label: "Account",
        to: {
          name: routeNames.login
        }
      },
      {
        click: () => {},
        label: "Log Out"
      }
    ] as PropsAdminHeaderAccountBtns[])
  })

  const adminHeaderAccountUser = "MD"

  return { adminHeaderAccountNav, adminHeaderAccountUser }
}