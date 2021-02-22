import Btn, { btnProps, BtnProps } from './Btn'
import { defineComponent } from "vue";

export default defineComponent({
  name: "LoginButton",
  props: btnProps,
  setup (props: BtnProps) {
    return () => <Btn
      class="bg-gray-700 flex flex-nowrap font-medium items-center justify-center py-2 px-4 rounded-md shadow text-gray-100 text-lg transition w-full hover:bg-gray-800 hover:shadow-md hover:text-white"
      click={props.click}
      icon={props.icon}
      label={props.label}
      reverse={true}
    />
  }
})