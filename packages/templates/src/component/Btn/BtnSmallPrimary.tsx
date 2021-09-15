import Btn, { btnProps } from './Btn'
import { defineComponent } from "vue";

export default defineComponent({
  name: "BtnSmallPrimary",
  props: btnProps,
  setup (props, ctx) {
    return () => { 
      return (
        <Btn 
          class="bg-gray-600 focus:bg-gray-700 hover:bg-blue-700font-semibold p-2 s550:px-3 rounded text-xs text-gray-100 focus:text-white hover:text-white"
          {...props}
        >{ctx.slots.default && ctx.slots.default()}</Btn>
      )
    }
  } 
})

