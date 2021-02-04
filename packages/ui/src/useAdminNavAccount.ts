import { AdminNavItemProps } from "./components/AdminNavItem/AdminNavItem";
import { computed } from 'vue'
import { routeNames } from "./playground/routeNames";

export const useAdminNavAccount = () => {

  const adminNavAccount = computed<AdminNavItemProps[]>(() => {
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
    ] as AdminNavItemProps[])
  })

  return { adminNavAccount }
}