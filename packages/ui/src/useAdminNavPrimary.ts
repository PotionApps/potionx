import { computed } from 'vue'
import { routeNames } from "./playground/routeNames";
import { faInbox, faUsers } from "@fortawesome/free-solid-svg-icons";
import { RouteLocationRaw } from "vue-router";

export const useAdminNavPrimary = () => {
  const adminNavPrimary = computed<{label: string, to: RouteLocationRaw}[]>(() => {
    return [
      {
        label: "Content",
        to: {
          name: routeNames.login
        }
      },
      {
        icon: faInbox,
        label: "Inbox",
        notification: 14,
        to: {
          name: routeNames.admin
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
        notification: 3,
        to: {
          name: routeNames.login
        }
      },
      {
        icon: faUsers,
        label: "People",
        to: {
          name: routeNames.admin
        }
      }
    ]
  })

  return { adminNavPrimary }
}