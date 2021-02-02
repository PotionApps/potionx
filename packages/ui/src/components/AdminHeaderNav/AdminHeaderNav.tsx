import { defineComponent, Ref, PropType } from 'vue'
import { RouteLocationRaw } from 'vue-router'

export interface AdminHeaderNavItem { 
  click?: () => void,
  icon?: any,
  isActive?: Ref<boolean>
  notification?: number,
  label: string,
  to: RouteLocationRaw
}

export interface AdminHeaderNavProps {
  nav: AdminHeaderNavItem[]
}

export default defineComponent({
  name: "AdminHeaderNav",
  props: {
    nav: {
      type: Object as PropType<AdminHeaderNavItem[]>,
      required: true
    }
  },
  setup (props, ctx) {
    return () => {
    return <nav class="absolute flex h-10 items-center justify-center left-2/4 top-0 transform -translate-x-1/2">
        {
          props.nav.map(n => <router-link
            class="hover:text-white mx-2 text-gray-300 transition-colors"
            exactActiveClass="text-white"
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
