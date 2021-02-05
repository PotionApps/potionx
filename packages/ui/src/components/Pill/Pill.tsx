import { defineComponent, mergeProps, PropType } from "vue";
import Times from '../../assets/times.svg'

export interface PillProps {
  bg?: string
  borderColor?: string
  color?: string
  customBg?: string
  customIcon?: string
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
          <img class="flex-fit mr-1 w-4" src={props.icon} />
          <span class="font-semibold text-gray-900 text-xs s650:text-sm">{props.label}</span>
          {props.remove && <div class="cursor-pointer ml-2" onClick={props.remove}>
            <img class="opacity-60 w-3 transition-opacity hover:opacity-100" src={Times} />
          </div>}
        </div>
      )
    }
  }
})
