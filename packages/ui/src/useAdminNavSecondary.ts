import { AdminNavItemProps } from "./components/AdminNavItem/AdminNavItem";
import { computed } from 'vue'
import { routeNames } from "./playground/routeNames";

export const useAdminNavSecondary = () => {

  const adminNavSecondary = computed<AdminNavItemProps[]>(() => {
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
    ])
  })

  return { adminNavSecondary }
}