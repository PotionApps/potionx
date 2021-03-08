import Btn, { btnProps, BtnProps } from './Btn'
import { defineComponent } from "vue";

export default defineComponent({
  name: "LoginButton",
  props: btnProps,
  setup (props: BtnProps) {
    return () => <Btn
      class="bg-gray-700 focus:bg-gray-800 hover:bg-gray-800 flex flex-nowrap font-medium items-center justify-center py-2 px-4 rounded-md shadow focus:shadow-md hover:shadow-md text-gray-100 focus:text-white hover:text-white text-lg transition w-full"
      click={props.click}
      icon={props.icon}
      label={props.label}
      reverse={true}
    />
  }
})