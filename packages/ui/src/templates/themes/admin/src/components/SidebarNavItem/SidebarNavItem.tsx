import { defineComponent, PropType, computed } from "vue";
import { FontAwesomeIcon } from '../../../fontawesomeTypeFix'
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
      return "block opacity-70 text-gray-100 transition-opacity w-full hover:opacity-100"
    })
    return () => {
      const slot = <div class="flex items-center justify-between">
        <div class="flex items-center">
          {props.icon && <div class="flex items-center justify-center mr-2 w-5">
              <FontAwesomeIcon icon={props.icon} />
            </div>
          }
          {props.label}
          {ctx.slots.default && ctx.slots.default()}
        </div>
        {
          props.notification &&
          <div class="bg-blue-500 flex ml-1 px-1.5 py-0.5 rounded-full">
            <span class="font-semibold text-white text-xs">{props.notification}</span>
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