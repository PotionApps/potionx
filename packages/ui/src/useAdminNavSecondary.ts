import { computed } from 'vue'
import { routeNames } from "./playground/routeNames";
import { faSignOutAlt, faUser } from "@fortawesome/free-solid-svg-icons";
import { RouteLocationRaw } from "vue-router";

export const useAdminNavSecondary = () => {
  const adminNavSecondary = computed<{label: string, to: RouteLocationRaw}[]>(() => {
    return [
      {
        label: "Account",
        icon: faUser,
        to: {
          name: routeNames.login
        }
      },
      {
        click: () => {},
        icon: faSignOutAlt,
        label: "Log Out"
      }
    ]
  })

  return { adminNavSecondary }
}

