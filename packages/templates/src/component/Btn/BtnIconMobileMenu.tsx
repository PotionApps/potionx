import Btn, { btnProps } from './Btn'
import { defineComponent } from "vue";

export default defineComponent({
  name: "BtnIconMobileMenu",
  props: btnProps,
  setup (props) {
    return () => { 
      return (
      <Btn 
        class="bg-gray-700 focus:bg-gray-600 hover:bg-gray-600 flex flex-fit h-auto items-center justify-center mr-2 px-3 py-2 rounded text-gray-300 w-auto"
        click={props.click}
        icon={props.icon}
        to={props.to}
      />
    )
  }
}})

