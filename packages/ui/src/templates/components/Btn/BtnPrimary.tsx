import Btn, { btnProps, BtnProps } from './Btn'
import { defineComponent } from "vue";

export default defineComponent({
  name: "BtnPrimary",
  props: btnProps,
  setup (props: BtnProps, ctx) {
    return () => { 
      return (
        <Btn 
          class="bg-gray-300 focus:bg-gray-400 hover:bg-gray-400 font-semibold py-2 px-2 s550:px-3 rounded text-sm s550:text-base text-gray-700 focus:text-gray-900 hover:text-gray-900"
          {...props}
        >{ctx.slots.default && ctx.slots.default()}</Btn>
      )
    }
  } 
})

