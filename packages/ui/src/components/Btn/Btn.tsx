import { defineComponent, computed, PropType, resolveComponent } from "vue";
import { RouteLocationRaw } from "vue-router";

export interface PropsBtn {
  click?: (e?: MouseEvent) => void
  disabled?: boolean
  icon?: {}
  id?: string
  label?: string
  noStyle?: boolean
  status?: 'disabled' | 'error' | 'loading' | 'success' | null
  to?: RouteLocationRaw
  toExternal?: string
  type?: "button" | "submit"
}

export default defineComponent({
  name: "potion-button",
  props: {
    click:  Function as PropType<PropsBtn['click']>,
    disabled: Boolean,
    icon: {} as any,
    label: String,
    noStyle: Boolean,
    status: String as PropType<PropsBtn['status']>,
    to: Object as PropType<PropsBtn['to']>,
    toExternal: String,
    type: String
  },
  setup (props, context) {

    const eventHandlers = computed(() => {
      let on : any = {}
      if (props.click && !props.disabled) {
        on.onClick = props.click
      }
      return on
    })

    const classes = computed(() => {
      if (props.noStyle) return []
      return {
        "bg-gray-200": true,
        "hover:bg-gray-300": true,
        "text-gray-700": true,
        "font-semibold": true,
        "text-base": true,
        "p-2": true,
        "flex": true,
        "items-center": true,
        "justify-center": true,
        "rounded-base": true,
        "opacity-80": props.disabled,
        "pointer-events-none": props.disabled,
        "bg-red-400": props.status === "error",
        "bg-blue-400": props.status === "loading",
        "bg-green-400": props.status === "success",
        "color-white": props.status === "error" || props.status === "loading" || props.status === "success"
      }
    })

    return () => {
      let attrs : any = {...eventHandlers.value}
      let Parent : any = 'button'
      if (props.type) attrs.type = props.type
      if (props.to) {
        attrs = { to: props.to }
        Parent = resolveComponent('router-link')
      }
      if (props.toExternal) {
        attrs = { attrs: {href: props.toExternal, target: "_blank"}}
        Parent = "a"
      }
      return <Parent class={classes.value} {...attrs}>
        {props.label && <span>{props.label}</span>}
        {props.icon && <img class="ml-1 h-3" src={props.icon} />}
        {context.slots.default && context.slots.default()}
      </Parent>
    }
  }
})
