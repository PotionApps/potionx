import { defineComponent, PropType, computed } from "vue";
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { RouteLocationRaw } from "vue-router";

export interface SidebarNavItemProps {
  click?: (e?: MouseEvent) => void
  icon?: any
  id?: string
  label?: string
  notification?: number
  to?: RouteLocationRaw
}

export default defineComponent({
  props: {
    click: Function as PropType<(e?: MouseEvent) => void>,
    icon: Object,
    label: String,
    notification: Number,
    to: {
      type: [Object, String] as PropType<RouteLocationRaw>
    }
  },
  setup (props: SidebarNavItemProps, ctx) {
    const classes = computed(() => {
      return "flex items-center justify-between opacity-70 hover:opacity-100 transition-opacity text-gray-100 w-full"
    })
    return () => {
      const slot = <div class="flex items-center">
        {props.icon && <FontAwesomeIcon class="text-gray-100 mr-2 w-4" icon={props.icon} />}
        {props.label}
        {ctx.slots.default && ctx.slots.default()}
        {
          props.notification &&
          <div class="bg-blue-500 flex ml-2 px-2 py-1 rounded-full">
            <span class="font-semibold text-gray-100 text-sm">{props.notification}</span>
          </div>
        }
      </div>

      if (props.click) {
        return <button class={classes.value} onClick={props.click}>{slot}</button>
      }
      return <router-link
        class={classes.value}
        exactActiveClass="opacity-100"
        to={props.to}
      >
        {slot}
      </router-link>
    }
  }
})