import { ref, Ref } from 'vue'
import { SidebarNavItemProps } from 'root/components/SidebarNavItem/SidebarNavItem'

const nav : Ref<SidebarNavItemProps[]> = ref([])

export default () => {
  return nav
}