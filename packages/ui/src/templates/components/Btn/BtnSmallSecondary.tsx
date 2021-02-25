import Btn, { btnProps, BtnProps } from './Btn'
import { defineComponent } from "vue";

export default defineComponent({
  name: "BtnSmallSecondary",
  props: btnProps,
  setup (props: BtnProps, ctx) {
    return () => { 
      return (
        <Btn 
          class="bg-gray-300 focus:bg-gray-400 hover:bg-gray-400 font-semibold p-2 s550:px-3 rounded text-xs text-gray-700 focus:text-gray-900 hover:text-gray-900"
          {...props}
        >{ctx.slots.default && ctx.slots.default()}</Btn>
      )
    }
  } 
})

