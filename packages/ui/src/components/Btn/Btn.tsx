import { defineComponent, computed, PropType, resolveComponent } from "vue";
import { RouteLocationRaw } from "vue-router";

export interface PropsBtn {
  activeBg?: string
  activeColor?: string
  bgLess?: boolean
  bg?: string
  color?: string
  click?: (e?: MouseEvent) => void
  disabled?: boolean
  full?: boolean
  hoverBg?: string
  hoverColor?: string
  icon?: {}
  id?: string
  label?: string
  left: boolean
  noActive?: boolean
  noHover?: boolean
  noLabel?: boolean
  replace?: boolean
  reverse?: boolean
  size?: (string | [string, number])[] | string
  to?: RouteLocationRaw
  toExternal?: string
  type?: "button" | "submit"
}

export default defineComponent({
  name: "potion-button",
  props: {
    activeBg: String,
    activeColor: String,
    bg: {
      default: "grayscale-200",
      type: String
    },
    bgLess: Boolean,
    color: String,
    click: {
      type: Function as PropType<PropsBtn['click']>
    },
    disabled: Boolean,
    full: Boolean,
    hoverBg: String,
    hoverColor: String,
    icon: {} as any,
    label: String,
    left: Boolean,
    noActive: Boolean,
    noHover: Boolean,
    noLabel: Boolean,
    replace: Boolean,
    reverse: Boolean,
    to: Object as PropType<PropsBtn['to']>,
    toExternal: String,
    size: [String, Array] as any
  },
  setup (props: PropsBtn, context) {

    const eventHandlers = computed(() => {
      let on : any = {}
      if (props.click && !props.disabled) {
        on.onClick = props.click
      }
      return on
    })
 
    return () => {
      let attrs : any = {...eventHandlers.value}
      let Parent : any = 'button'
      if (props.type) attrs.type = props.type
      if (props.to) {
        attrs = { replace: props.replace, to: props.to }
        Parent = resolveComponent('router-link')
      }
      if (props.toExternal) {
        attrs = { attrs: {href: props.toExternal, target: "_blank"}}
        Parent = "a"
      }
      return <Parent class="" {...attrs}>
        <span>{props.label}</span>
      </Parent>
    }
  }
})
