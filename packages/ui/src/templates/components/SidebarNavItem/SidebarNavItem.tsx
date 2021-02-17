import { defineComponent, PropType, computed } from "vue";
import { FontAwesomeIcon } from '@potionapps/utils'
import { RouteLocationRaw } from "vue-router";

export interface SidebarNavItemProps {
  click?: (e?: MouseEvent) => void
  icon?: any
  id?: string
  image?: string
  label?: string
  notification?: number
  parentId?: string
  to?: RouteLocationRaw
}

export default defineComponent({
  props: {
    click: Function as PropType<(e?: MouseEvent) => void>,
    icon: Object,
    image: String,
    label: String,
    notification: Number,
    parentId: String,
    to: [Object, String] as PropType<RouteLocationRaw>
  },
  setup (props: SidebarNavItemProps, ctx) {
    const classes = computed(() => {
      return ["block opacity-70 rounded text-gray-100 transition-opacity w-full hover:opacity-100", props.parentId ? "px-4 py-1.5 text-xs" : "px-2 py-1"]
    })
    return () => {
      const slot = <div class="flex items-center justify-between">
        <div class="flex items-center">
          {props.icon && !props.image && <div class={["flex items-center justify-center mr-2", props.parentId ? "w-4" : "w-5"]}>
            <FontAwesomeIcon icon={props.icon} />
          </div>}
          {props.image && <img class="h-5 mr-2 object-cover rounded-full w-5" src={props.image} />}
          {props.label}
          {ctx.slots.default && ctx.slots.default()}
        </div>
        {
          props.notification &&
          <div class={["bg-blue-500 flex ml-1 py-0.5 rounded-full", props.parentId ? "px-1" : "px-1.5"]}>
            <span class={["font-semibold text-white", props.parentId ? "text-2xs" : "text-xs"]}>{props.notification}</span>
          </div>
        }
      </div>

      if (props.click) {
        return <button class={classes.value} onClick={props.click}>{slot}</button>
      }
      return <router-link
        class={classes.value}
        exactActiveClass="bg-gray-700 opacity-100"
        to={props.to}
      >
        {slot}
      </router-link>
    }
  }
})