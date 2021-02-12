import { computed } from 'vue'
import { RouteLocationRaw } from "vue-router";
import { routeNames } from './routes/routeNames'
import { SidebarNavItemProps } from './components/SidebarNavItem/SidebarNavItem'

const nav : SidebarNavItemProps[] = []

export const useAdminNavPrimary = () => {
  return computed(() => nav)
}