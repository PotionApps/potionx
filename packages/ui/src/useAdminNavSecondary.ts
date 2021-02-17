import { computed } from 'vue'
import { routeNames } from "./playground/routeNames";
import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { RouteLocationRaw } from "vue-router";
import Musk from './assets/Musk.png';

export const useAdminNavSecondary = () => {
  const adminNavSecondary = computed<{label: string, to: RouteLocationRaw}[]>(() => {
    return [
      {
        label: "Account",
        image: Musk,
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

