import { computed, defineComponent, PropType } from "vue"
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@potionapps/utils';

export interface PillProps {
  icon?: {}
  iconColor?: string
  label?: string
  remove?: () => void
}

export default defineComponent({
  name: "Pill",
  props: {
    icon: {} as any,
    iconColor: String,
    label: String,
    remove: Function as PropType<PillProps['remove']>,
  },
  setup (props: PillProps, ctx) {

    const iconStyle = computed(() => {
      if (!props.iconColor) {
        return null
      }
      return {
        color: props.iconColor
      }
    })

    return () => {
      return (
        <div class="bg-white border-1 border-gray-300 inline-flex items-center px-2 py-0.5 rounded-2xl">
          {
            props.icon &&
            <FontAwesomeIcon
              class={["flex-fit mr-1 text-sm", !props.iconColor && "text-gray-500"]}
              icon={props.icon}
              style={iconStyle.value}
            />
          }
          {ctx.slots.default && ctx.slots.default()}
          {
            props.label &&
            <span class="font-semibold text-gray-900 text-sm">{props.label}</span>
          }
          {props.remove && <div class="cursor-pointer ml-2" onClick={props.remove}>
            <FontAwesomeIcon class="text-base text-gray-400 hover:text-gray-900 transition" icon={faTimes} />
          </div>}
        </div>
      )
    }
  }
})
