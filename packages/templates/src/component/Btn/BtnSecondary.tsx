import Btn, { btnProps } from './Btn'
import { defineComponent } from "vue";

export default defineComponent({
  name: "BtnSecondary",
  props: btnProps,
  setup (propsprops, ctx) {
    return () => { 
      return (
        <Btn 
          class="bg-gray-200 focus:bg-gray-300 hover:bg-gray-300 font-semibold py-2 px-2 s550:px-3 rounded text-sm s550:text-base text-gray-700 focus:text-gray-900 hover:text-gray-900 transition"
          {...props}
        >{ctx.slots.default && ctx.slots.default()}</Btn>
      )
    }
  } 
})

