import { defineComponent, PropType } from "vue"
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

export interface PillProps {
  bg?: string
  borderColor?: string
  color?: string
  customBg?: string
  customicon?: string
  icon?: {}
  label?: string
  remove?: () => void
  size?: "large" 
}

export default defineComponent({
  name: "Pill",
  props: {
    bg: String,
    borderColor: String,
    color: String,
    customBg: String,
    customIcon: String,
    icon: {} as any,
    label: String,
    option: Boolean,
    remove: Function as PropType<PillProps['remove']>,
    size: String as PropType<'large'>
  },
  setup (props) {
    return () => {
      return (
        <div class="bg-gray-300 flex items-center px-2 py-1 rounded-2xl">
          <FontAwesomeIcon class="flex-fit mr-1 text-sm" icon={props.icon} />
          <span class="font-semibold text-gray-900 text-sm">{props.label}</span>
          {props.remove && <div class="cursor-pointer ml-2" onClick={props.remove}>
            <FontAwesomeIcon class="text-base text-gray-600 hover:text-gray-900 transition-color" icon={faTimes} />
          </div>}
        </div>
      )
    }
  }
})
