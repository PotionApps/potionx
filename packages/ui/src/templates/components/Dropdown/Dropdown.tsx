import { defineComponent } from "vue";
import { FontAwesomeIcon } from '@potionapps/utils';

export interface DropdownProps {
  icon?: Object
  label: string
}

export default defineComponent({
  name: "Dropdown",
  props: {
    icon: {},
    label: String
  },
  setup (props) {
    return () => {
      return (
        <div class="bg-white border-1 border-gray-300 cursor-pointer flex items-center p-2 rounded-md text-gray-400 transition hover:border-blue-400 hover:text-blue-400">
          {props.icon && <FontAwesomeIcon class="mr-1 text-base" icon={props.icon} />}
          <span class="text-gray-800">{props.label}</span>
        </div>
      )
    }
  }
})
