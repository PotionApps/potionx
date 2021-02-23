import { routeNames } from "./playground/routeNames";
import { faSignOutAlt, faUser } from "@fortawesome/free-solid-svg-icons";
import { Ref, ref } from 'vue'
import { SidebarNavItemProps } from 'root/components/SidebarNavItem/SidebarNavItem'

const nav : Ref<SidebarNavItemProps[]> = ref([
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
])

export default () => {
  return nav
}