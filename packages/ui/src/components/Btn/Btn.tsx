import { defineComponent, PropType } from "vue";
import { RouteLocationRaw } from "vue-router";

export interface PropsBtn {
  click?: (e?: MouseEvent) => void
  icon?: {}
  id?: string
  label?: string
  to?: RouteLocationRaw
}

export default defineComponent({
  name: "potion-button",
  props: {
    click: {
      type: Function as PropType<PropsBtn['click']>
    },
    icon: {} as any,
    label: String,
    to: Object as PropType<PropsBtn['to']>
  },
  setup (props, context) {
    return () => {
      return <router-link class="" to={props.to}>
        <span>{props.label}</span>
      </router-link>
    }
  }
})
