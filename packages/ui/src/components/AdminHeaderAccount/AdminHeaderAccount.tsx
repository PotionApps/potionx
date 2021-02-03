import { defineComponent, onBeforeUnmount, onMounted, PropType, ref } from "vue";
import Btn, { PropsBtn } from '../Btn/Btn'

export interface AdminHeaderAccountProps {
  btns: PropsBtn[]
  image?: string,
  initials?: string
}

export default defineComponent({
  name: "AdminHeaderAccount",
  props: {
    btns: {
      type: Array as PropType<PropsBtn[]>,
      required: true
    },
    image: String,
    initials: String
  },
  setup (props: AdminHeaderAccountProps, context) {
    const dropdown = ref(false)
    const events : (keyof HTMLElementEventMap)[] = ['touchstart', 'click']
  
    onBeforeUnmount(() => {
      events.map(e => document.body.removeEventListener(e, maybeClose))
    })
  
    onMounted(() => {
      events.map(e => document.body.addEventListener(e, maybeClose))
    })

    const toggleDropdown = (e: Event) => {
      e.stopPropagation()
      if ((e.target as any).closest('[data-dropdown]')) return
      dropdown.value = !dropdown.value
    }
  
    const maybeClose = (e: Event) => {
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
            <img class="h-6 w-6 rounded-full" src={props.image} /> 
          }
          {
            !props.image &&
            <div class="items-center flex bg-gray-200 rounded-full justify-center h-6 w-6">
              <div class={["text-gray-800", "text-2xs", "uppercase", "font-semibold"]}>{props.initials}</div>
            </div>
          }
          {
            dropdown.value &&
            <div class="bg-white bottom-0 shadow-lg w-48 pt-6 px-6 pb-4 absolute right-0 z-5 transform translate-y-full">
              {
                props.btns?.map(props => <Btn
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
