import Btn, { BtnProps } from './Btn'
import { defineComponent } from "vue";

export default defineComponent((props: BtnProps) => <Btn 
    class="bg-gray-300 flex-fit font-semibold h-8 p-0 rounded-full text-base text-gray-700 w-8 hover:bg-gray-400 hover:text-gray-900"
    {...props}
  />
)
