import { AdminNavItemProps } from "./components/AdminNavItem/AdminNavItem";
import { computed } from 'vue'
import { routeNames } from "./playground/routeNames";

export const useAdminNavModules = () => {
 
  const adminNavModules = computed<AdminNavItemProps[]>(() => {
    return ([
      {
        label: "Content",
        to: {
          name: routeNames.admin
        }
      },
      {
        label: "Inbox",
        to: {
          name: routeNames.login
        }
      }
    ] as AdminNavItemProps[])
  })

  return { adminNavModules }
}