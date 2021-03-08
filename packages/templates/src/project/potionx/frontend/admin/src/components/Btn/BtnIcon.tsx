import Btn, { btnProps, BtnProps } from './Btn'
import { defineComponent } from "vue";

export default defineComponent({
  name: "BtnIcon",
  props: btnProps,
  setup (props: BtnProps) {
    return () => { 
      return (
      <Btn 
        class="bg-gray-300 focus:bg-gray-400 hover:bg-gray-400 flex-fit font-semibold h-8 p-0 rounded-full text-base text-gray-700 focus:text-gray-900 hover:text-gray-900 w-8"
        click={props.click}
        icon={props.icon}
        to={props.to}
      />
    )
  }
}})

