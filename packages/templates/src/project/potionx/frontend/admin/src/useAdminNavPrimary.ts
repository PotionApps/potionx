import { ref, Ref } from 'vue'
import { SidebarNavItemProps } from 'root/components/SidebarNavItem/SidebarNavItem'
import { routeNames } from './routes/routeNames'

const nav : Ref<SidebarNavItemProps[]> = ref([])

export default () => {
  return nav
}
nav.value.push(
  {
    label: "Users",
    to: {
      name: routeNames.userList
    }
  }
)