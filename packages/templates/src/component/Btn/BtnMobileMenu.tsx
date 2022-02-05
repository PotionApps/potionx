import Btn, { btnProps } from './Btn'
import { defineComponent } from "vue";

export default defineComponent({
  name: "BtnMobileMenu",
  props: btnProps,
  setup (props) {
    return () => { 
      return (
      <Btn 
        class="bg-gray-700 focus:bg-gray-600 hover:bg-gray-600 font-semibold mr-2 rounded text-gray-300 w-full"
        {...props}
      />
    )
  }
}})

