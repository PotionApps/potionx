import Btn, { btnProps } from './Btn'
import { defineComponent } from "vue";

export default defineComponent({
  name: "BtnSmall",
  props: btnProps,
  setup (propsprops, ctx) {
    return () => { 
      return (
        <Btn 
          class="font-semibold p-2 s550:px-3 rounded text-xs"
          {...props}
        >{ctx.slots.default && ctx.slots.default()}</Btn>
      )
    }
  } 
})

