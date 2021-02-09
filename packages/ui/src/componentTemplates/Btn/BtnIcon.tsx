import Btn from './Btn'
import { defineComponent, PropType } from "vue";
import { RouteLocationRaw } from "vue-router";

export default defineComponent({
  props: {
    click: Function as PropType<(e?: MouseEvent) => void>,
    disabled: Boolean,
    icon: Object,
    id: String,
    to: {
      type: [Object, String] as PropType<RouteLocationRaw>
    },
    toExternal: String,
    type: String
  },
  setup (props) {

    return () => {
      return <Btn 
        class="bg-gray-300 flex-fit font-semibold h-8 p-0 rounded-full text-base text-gray-700 w-8 hover:bg-gray-400 hover:text-gray-900"
        {...props}
      />
    }
  }
})
