import { defineComponent, PropType } from "vue";
import { FontAwesomeIcon } from "@potionapps/utils";

export default defineComponent({
  props: {
    icon: {},
    remove: Function as PropType<(e?: MouseEvent) => void>,
    title: {
      required: true,
      type: String
    }
  },
  setup (props) {
    return () =>
      <div class='flex flex-col items-center justify-center'>
        {
          props.icon &&
            <FontAwesomeIcon
              class="text-4xl text-gray-600"
              icon={props.icon}
            />
        }
        <p class='mt-1 text-gray-600 text-xs'>{props.title}</p>
        {
          props.remove &&
          <p
            class="border-b border-gray-200 cursor-pointer hover:border-red-400 hover:text-red-600 mt-1 text-gray-400 text-xs"
            onClick={props.remove}
            style="padding-bottom: 2px"
          >
            Remove
          </p>
        }
      </div>
  }
})