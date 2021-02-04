import { defineComponent, computed, PropType, resolveComponent } from "vue";
import { RouteLocationRaw } from "vue-router";

export interface AdminNavItemProps {
  click?: (e?: MouseEvent) => void
  image?: {}
  id?: string
  label?: string
  notification?: number
  to?: RouteLocationRaw
}

export default defineComponent({
  name: "AdminNavItem",
  props: {
    click: Function as PropType<AdminNavItemProps['click']>,
    image: {} as any,
    label: String,
    notification: Number,
    to: Object as PropType<AdminNavItemProps['to']>,
  },
  setup (props, context) {

    const eventHandlers = computed(() => {
      let on : any = {}
      if (props.click) {
        on.onClick = props.click
      }
      return on
    })

    return () => {
      let attrs : any = {...eventHandlers.value}
      let Parent : any = 'button'
      if (props.to) {
        attrs = { to: props.to, exactActiveClass: "opacity-100" }
        Parent = resolveComponent('router-link')
      }

      return <Parent class="flex items-center justify-between opacity-70 hover:opacity-100 transition-opacity" {...attrs}>
        <div class="flex items-center">
          {props.image && <img class="mr-2 w-4" src={props.image} />}
          <span class="text-gray-100">{props.label}</span>
        </div>
        {
          props.notification &&
          <div class="bg-blue-500 rounded-t-full">
            <span class="text-gray-100 text-sm">{props.notification}</span>
          </div>
        }
      </Parent>
    }
  }
})
