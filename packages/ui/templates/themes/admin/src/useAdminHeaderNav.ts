import { AdminHeaderNavProps } from "@potionapps/ui";
import { computed, Ref } from "vue";
import { routeNames } from './routes/routeNames'

const nav : AdminHeaderNavProps['nav'] = []

export default () : Ref<AdminHeaderNavProps> => {
  return computed(() => {
    return {
      nav
    }
  })
}