import { computed } from 'vue'
import { SidebarNavItemProps } from 'root/components/SidebarNavItem/SidebarNavItem'

const nav : SidebarNavItemProps[] = []

export const useAdminNavPrimary = () => {
  return computed(() => nav)
}