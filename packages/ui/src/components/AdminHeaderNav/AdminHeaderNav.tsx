import { defineComponent, Ref, PropType } from 'vue'
import { RouteLocationRaw } from 'vue-router'

export interface PropsAdminHeaderNav {
  click?: () => void,
  icon?: any,
  isActive?: Ref<boolean>
  notification?: number,
  label: string,
  to: RouteLocationRaw
}

export default defineComponent({
  name: "AdminHeaderNav",
  props: {
    nav: {
      type: Object as PropType<Ref<PropsAdminHeaderNav[]>>,
      required: true
    }
  },
  setup (props, ctx) {
    return () => {
    return <nav class="h-10 flex items-center justify-center absolute left-2/4 top-0" style="transform: translate(-50%, 0);">
        {
          props.nav.value.map(n => <router-link
            class="text-gray-300 hover:text-white mx-2 transition-colors"
            to={n.to}
          >
            <span>{n.label}</span>
          </router-link>
          )
        }
      </nav>
    }
  }
})
