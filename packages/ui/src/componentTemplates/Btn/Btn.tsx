import { defineComponent, computed, PropType } from "vue";
import { FontAwesomeIcon } from '../../fontawesomeTypeFix';
import { RouteLocationRaw } from "vue-router";

export interface BtnProps {
  click?: (e?: MouseEvent) => void
  disabled?: boolean
  icon?: {}
  id?: string
  label?: string
  reverse?: boolean
  to?: RouteLocationRaw
  toExternal?: string
  type?: "button" | "submit"
}

export default defineComponent({
  props: {
    click: Function as PropType<(e?: MouseEvent) => void>,
    disabled: Boolean,
    icon: Object,
    label: String,
    reverse: Boolean,
    to: {
      type: [Object, String] as PropType<RouteLocationRaw>
    },
    toExternal: String,
    type: String
  },
  setup (props, context) {
    const classes = computed(() => [
      "flex items-center justify-center transition",
      props.disabled && "opacity-50 pointer-events-none"
    ])

    const imgClasses = computed(() => {
      return {
        "ml-2": props.reverse && props.label,
        "mr-2": !props.reverse && props.label
      }
    })

    return () => {
      const slot = <div class={["flex items-center justify-center", props.reverse && "flex-row-reverse"]}>
        {props.icon && <FontAwesomeIcon class={imgClasses.value} icon={props.icon} />}
        {props.label && <span class="whitespace-nowrap">{props.label}</span>}
        {context.slots.default && context.slots.default()}
      </div>

      if (props.click) {
        return <button class={classes.value} onClick={props.click}>{slot}</button>
      }
      return <router-link
        class={classes.value}
        to={props.to}
      >
        {slot}
      </router-link>
    }
  }
})
