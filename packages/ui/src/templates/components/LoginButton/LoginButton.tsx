import { defineComponent, PropType } from "vue";
import { FontAwesomeIcon } from '@potionapps/utils';

export interface LoginButton {
  click: (e?: MouseEvent) => any
  icon: Object,
  label: string
}

export default defineComponent({
  name: "LoginButton",
  props: {
    click: Function as PropType<(e?: MouseEvent) => void>,
    icon: {},
    label: String
  },
  setup (props) {
    return () => <button
      class="bg-gray-700 flex flex-nowrap items-center justify-center py-2 px-4 rounded-md shadow text-gray-100 text-lg transition w-full hover:bg-gray-800 hover:shadow-md hover:text-white"
      onClick={props.click}
    >
      <span class="font-medium">{props.label}</span>
      <FontAwesomeIcon class="ml-2" icon={props.icon} />
    </button>
  }
})