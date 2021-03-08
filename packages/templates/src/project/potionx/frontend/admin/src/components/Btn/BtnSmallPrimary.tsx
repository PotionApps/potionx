import Btn, { btnProps, BtnProps } from './Btn'
import { defineComponent } from "vue";

export default defineComponent({
  name: "BtnSmallPrimary",
  props: btnProps,
  setup (props: BtnProps, ctx) {
    return () => { 
      return (
        <Btn 
          class="bg-gray-700 focus:bg-gray-900 hover:bg-blue-800 font-semibold p-2 s550:px-3 rounded text-xs text-gray-100 focus:text-white hover:text-white"
          {...props}
        >{ctx.slots.default && ctx.slots.default()}</Btn>
      )
    }
  } 
})

