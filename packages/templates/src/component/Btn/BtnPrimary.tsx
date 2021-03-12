import Btn, { btnProps, BtnProps } from './Btn'
import { defineComponent } from "vue";

export default defineComponent({
  name: "BtnPrimary",
  props: btnProps,
  setup (props: BtnProps, ctx) {
    return () => { 
      return (
        <Btn 
          class="bg-gray-600 focus:bg-gray-700 hover:bg-blue-700font-semibold py-2 px-2 s550:px-3 rounded text-sm s550:text-base text-gray-100 focus:text-white hover:text-white"
          {...props}
        >{ctx.slots.default && ctx.slots.default()}</Btn>
      )
    }
  } 
})

