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
        notification: 14,
        to: {
          name: routeNames.login
        }
      },
      {
        label: "Websites",
        to: {
          name: routeNames.login
        }
      },
      {
        label: "Forms",
        to: {
          name: routeNames.login
        }
      },
      {
        label: "People",
        to: {
          name: routeNames.login
        }
      },
    ] as AdminNavItemProps[])
  })

  return { adminNavModules }
}