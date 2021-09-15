import { defineComponent, computed, PropType } from "vue";
import { FontAwesomeIcon } from '@potionapps/utils';
import { RouteLocationRaw } from "vue-router";

export const btnProps : any = {
  click: Function as PropType<(e?: MouseEvent) => any>,
  disabled: Boolean,
  icon: Object,
  label: String,
  reverse: Boolean,
  to: {
    type: [Object, String] as PropType<RouteLocationRaw>
  },
  toExternal: String,
  type: String
}

export interface BtnProps {
  click?: (e?: MouseEvent) => any
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
  name: "Btn",
  props: btnProps,
  setup (propsprops, ctx) {
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
        {ctx.slots.default && ctx.slots.default()}
      </div>

      if (props.toExternal) {
        return <a class={classes.value} href={props.toExternal} target="_blank">{slot}</a>
      }

      const eventHandlers : any = {}

      if (!props.to) {
        if (props.click) eventHandlers.onClick = props.click
        return <button class={classes.value} {...eventHandlers} type={props.type}>{slot}</button>
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
