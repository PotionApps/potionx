import { defineComponent, computed, PropType, resolveComponent } from "vue";
import { RouteLocationRaw } from "vue-router";

export interface PropsBtn {
  click?: (e?: MouseEvent) => void
  disabled?: boolean
  icon?: {}
  id?: string
  label?: string
  noStyle?: boolean
  reverse?: boolean
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
    reverse: Boolean,
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
      return [
        {
          "bg-gray-200": !props.noStyle,
          "hover:bg-gray-300": !props.noStyle,
          "text-gray-700": !props.noStyle,
          "font-semibold": !props.noStyle,
          "text-base": !props.noStyle,
          "px-3": !props.noStyle,
          "py-2": !props.noStyle,
          "rounded-base": !props.noStyle,
          "opacity-80": props.disabled,
          "pointer-events-none": props.disabled,
          "bg-red-400": props.status === "error",
          "bg-blue-400": props.status === "loading",
          "bg-green-400": props.status === "success",
          "color-white": props.status === "error" || props.status === "loading" || props.status === "success",
          "flex-row-reverse": props.reverse,
          "transition": true,
          "flex": true,
          "items-center": true,
          "justify-center": true
        }
      ]
    })

    const imgClasses = computed(() => {
      return [
        {
          "ml-2": props.reverse && props.label,
          "mr-2": !props.reverse && props.label,
          "w-3": true
        }
      ]
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
        {props.icon && <img class={imgClasses.value} src={props.icon} />}
        {props.label && <span class="whitespace-nowrap">{props.label}</span>}
        {context.slots.default && context.slots.default()}
      </Parent>
    }
  }
})
