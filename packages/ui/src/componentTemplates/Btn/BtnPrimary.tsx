import Btn from './Btn'
import { defineComponent, PropType } from "vue";
import { RouteLocationRaw } from "vue-router";


export default defineComponent({
  props: {
    click: Function as PropType<(e?: MouseEvent) => void>,
    disabled: Boolean,
    icon: Object,
    id: String,
    label: String,
    reverse: Boolean,
    to: {
      type: [Object, String] as PropType<RouteLocationRaw>
    },
    toExternal: String,
    type: String
  },
  setup (props) {

    return  () => {
      return <Btn 
        class="bg-gray-300 font-semibold py-2 px-2 s550:px-3 rounded text-sm s550:text-base text-gray-700 hover:bg-gray-400 hover:text-gray-900"
        {...props}
      />
    }
  }
})
