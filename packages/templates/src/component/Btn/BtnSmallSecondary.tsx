import Btn, { btnProps } from './Btn'
import { defineComponent } from "vue";

export default defineComponent({
  name: "BtnSmallSecondary",
  props: btnProps,
  setup (props, ctx) {
    return () => { 
      return (
        <Btn 
          class="bg-gray-200 focus:bg-gray-300 hover:bg-gray-300 font-semibold p-2 s550:px-3 rounded text-xs text-gray-700 focus:text-gray-900 hover:text-gray-900"
          {...props}
        >{ctx.slots.default && ctx.slots.default()}</Btn>
      )
    }
  } 
})

