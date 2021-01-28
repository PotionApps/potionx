import { defineComponent, computed, onBeforeUnmount, onMounted, PropType, ref } from "vue";
import Btn, { PropsBtn } from '../Btn/Btn'

export interface PropsAccountMini {
  btns: PropsBtn[]
  image?: {},
  initials: string
}

export default defineComponent({
  name: "AdminHeaderAccount",
  props: {
    btns: {
      type: Array as PropType<PropsBtn[]>,
      required: true
    },
    image: Object,
    initials: String
  },
  setup (props, context) {
    const dropdown = ref(false)
      
    const events = ['touchstart', 'click']
  
    onBeforeUnmount(() => {
      events.map(e => document.body.removeEventListener(e, maybeClose))
    })
  
    onMounted(() => {
      events.map(e => document.body.addEventListener(e, maybeClose))
    })

    const toggleDropdown = (e: MouseEvent) => {
      e.stopPropagation()
      if ((e.target as any).closest('[data-dropdown]')) return
      dropdown.value = !dropdown.value
    }
  
    const maybeClose = (e: MouseEvent) => {
      const target = e.target as any
      if (target.closest('[data-dropdown]')) return
      dropdown.value = false
    }

    return () => {
      return (
        <div 
          class={["flex", "items-center", "relative", "hover:bg-blue-600", "h-full", "px-2", "cursor-pointer", dropdown.value && "bg-blue-600"]}
          onClick={toggleDropdown}
        >
          {
            props.image && 
            <img class="h-6 w-6 rounded-3xl" src={props.image} /> 
          }
          {
            !props.image &&
            <div class="items-center flex bg-gray-200 rounded-3xl justify-center h-6 w-6">
              <div class={["text-gray-800", "text-xs", "uppercase"]}>{props.initials}</div>
            </div>
          }
          {
            dropdown.value &&
            <div class="bg-white bottom-0 shadow-lg w-48 pt-6 px-6 pb-4 absolute right-0 z-5" style="transform: translate(0, 100%);">
              {
                props.btns.map(props => <Btn
                  class={["w-full", "mb-2"]}  
                  {...props} />
                )
              }
            </div>
          }
        </div>
      )
    }
  }
})
