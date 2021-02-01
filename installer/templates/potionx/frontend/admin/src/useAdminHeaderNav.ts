import { AdminHeaderNavProps } from "@potionapps/ui";
import { computed, Ref } from "vue";

const nav : AdminHeaderNavProps['nav'] = []

export default () : Ref<AdminHeaderNavProps> => {
  return computed(() => {
    return {
      nav
    }
  })
}