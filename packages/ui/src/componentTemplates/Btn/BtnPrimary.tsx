import Btn, { btnProps, BtnProps } from './Btn'
import { defineComponent } from "vue";

export default defineComponent({
props: btnProps,
setup (props: BtnProps) {
  return () => { 
    return (
    <Btn 
      class="bg-gray-300 font-semibold py-2 px-2 s550:px-3 rounded text-sm s550:text-base text-gray-700 hover:bg-gray-400 hover:text-gray-900"
      {...props}
    />
  )
}}})

