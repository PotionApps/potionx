import { Ref, ref } from 'vue'
import signOut from 'shared/signOut'
import { SidebarNavItemProps } from 'root/components/SidebarNavItem/SidebarNavItem'

const nav : Ref<SidebarNavItemProps[]> = ref([{
  click: signOut,
  label: "Log Out"
}])

export default () => {
  return nav
}