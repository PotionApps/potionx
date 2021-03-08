import { defineComponent } from "vue"
import { faFolderOpen } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@potionapps/utils';

export interface StateEmptyProps {
  icon?: Object
  label?: string
}

export default defineComponent({
  name: "StateEmpty",
  props: {
    icon: Object,
    label: String
  },
  setup (props: StateEmptyProps) {
    return () => {
      return (
        <div class="text-center">
          <div class="bg-white flex h-20 items-center justify-center mx-auto relative rounded-full w-20">
            <FontAwesomeIcon class="text-gray-400 text-5xl" icon={props.icon || faFolderOpen} />
          </div>
          <p class="mt-2 text-gray-500 text-xl">{props.label || "No Results"}</p>
        </div>
      )
    }
  }
})
