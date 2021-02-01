import { PropsAdminHeaderNav } from "./components/AdminHeaderNav/AdminHeaderNav";
import { computed } from 'vue'
import { routeNames } from "./playground/routeNames";

export const useAdminHeaderNav = () => {
 
  const adminHeaderNav = computed<PropsAdminHeaderNav[]>(() => {
    return ([
      {
        label: "Content",
        to: {
          name: routeNames.login
        }
      }
    ] as PropsAdminHeaderNav[])
  })

  return { adminHeaderNav }
}