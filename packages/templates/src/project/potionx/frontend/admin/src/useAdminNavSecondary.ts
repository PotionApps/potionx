import { Ref, ref } from 'vue'
import signOut from 'shared/signOut'
import { SidebarNavItemProps } from 'root/components/SidebarNavItem/SidebarNavItem'
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons'

const nav : Ref<SidebarNavItemProps[]> = ref([{
  click: signOut,
  icon: faSignOutAlt,
  label: "Log Out"
}])

export default () => {
  return nav
}