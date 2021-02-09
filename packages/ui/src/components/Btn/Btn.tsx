import './Btn.css';
import { defineComponent, computed, PropType, resolveComponent } from "vue";
import { RouteLocationRaw } from "vue-router";
import { FontAwesomeIcon } from '../../fontawesomeTypeFix';

export interface BtnProps {
  bg?: string
  color?: string
  bgHover?: string
  colorHover?: string
  click?: (e?: MouseEvent) => void
  disabled?: boolean
  fontSize?: string
  icon?: {}
  id?: string
  label?: string
  padding?: string
  radius?: string
  reverse?: boolean
  status?: 'disabled' | 'error' | 'loading' | 'success' | null
  to?: RouteLocationRaw
  toExternal?: string
  type?: "button" | "submit"
}

export default defineComponent({
  name: "Btn",
  props: {
    bg: String,
    color: String,
    bgHover: String,
    colorHover: String,
    click:  Function as PropType<BtnProps['click']>,
    disabled: Boolean,
    fontSize: String,
    icon: {} as any,
    label: String,
    padding: String,
    radius: String,
    reverse: Boolean,
    status: String as PropType<BtnProps['status']>,
    to: Object as PropType<BtnProps['to']>,
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
      return {
        "flex font-semibold items-center justify-center transition btnComponent": true,
        "flex-fit h-8 p-0 w-8": !props.label,
        "rounded-full": !props.label && !props.radius,
        [props.bg || "bg-gray-200"]: props.bg || !props.bg,
        ["hover:" + props.bgHover || "hover:bg-gray-300"]: props.bgHover || !props.bgHover,
        [props.color || "text-gray-700"]: props.color || !props.color,
        ["hover:" + props.colorHover || "hover:text-gray-700"]: props.colorHover || !props.colorHover,
        [props.fontSize || 'text-base']: props.fontSize || !props.fontSize,
        [props.padding || "px-3 py-2"]: props.padding || (!props.padding && props.label),
        [props.radius || 'rounded']: props.radius || (!props.radius && props.label),
        "flex-row-reverse": props.reverse,
        "bg-red-400": props.status === "error",
        "bg-blue-400": props.status === "loading",
        "bg-green-400": props.status === "success",
        "color-white": props.status === "error" || props.status === "loading" || props.status === "success",
        "opacity-50 pointer-events-none": props.disabled,
      }
    })

    const imgClasses = computed(() => {
      return {
        "ml-2": props.reverse && props.label,
        "mr-2": !props.reverse && props.label
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
        <FontAwesomeIcon class={imgClasses.value} icon={props.icon} />
        {props.label && <span class="whitespace-nowrap">{props.label}</span>}
        {context.slots.default && context.slots.default()}
      </Parent>
    }
  }
})
