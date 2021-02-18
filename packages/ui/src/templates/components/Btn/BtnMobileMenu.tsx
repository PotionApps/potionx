import Btn, { btnProps, BtnProps } from './Btn'
import { defineComponent } from "vue";

export default defineComponent({
  name: "BtnMobileMenu",
  props: btnProps,
  setup (props: BtnProps) {
    return () => { 
      return (
      <Btn 
        class="bg-gray-700 hover:bg-gray-600 mr-2 font-semibold text-gray-300 w-full"
        {...props}
      />
    )
  }
}})

