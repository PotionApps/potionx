import Btn, { btnProps } from './Btn'
import { defineComponent } from "vue";

export default defineComponent({
  name: "BtnIcon",
  props: btnProps,
  setup (props) {
    return () => { 
      return (
      <Btn 
        class="bg-gray-200 focus:bg-gray-300 hover:bg-gray-300 flex-fit font-semibold h-8 p-0 rounded-full text-base text-gray-700 focus:text-gray-900 hover:text-gray-900 w-8"
        click={props.click}
        icon={props.icon}
        to={props.to}
      />
    )
  }
}})

