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
        label: "New Message",
        parentId: "Inbox",
        notification: 14,
        to: {
          name: routeNames.login
        }
      },
      {
        label: "Categories",
        parentId: "Inbox",
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
        label: "New Form",
        parentId: "Forms",
        to: {
          name: routeNames.login
        }
      },
      {
        label: "Categories",
        parentId: "Forms",
        notification: 142,
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