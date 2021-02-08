import { defineComponent, PropType } from "vue";

export default defineComponent({
  props: {
    click: {
      required: true,
      type: Function as PropType<(e?: MouseEvent) => void>
    },
    icon: {
      required: true,
      type: String
    },
    label: {
      required: true,
      type: String
    }
  },
  setup (props) {
    return () => <button
      class="bg-white flex items-center justify-center py-2 px-4 flex-nowrap shadow w-full rounded-md hover:shadow-md"
      onClick={props.click}
    >
      <span class="text-lg font-medium text-gray-800 pr-2">{props.label}</span>
      <img class="h-8" src={props.icon} />
    </button>
  }
})