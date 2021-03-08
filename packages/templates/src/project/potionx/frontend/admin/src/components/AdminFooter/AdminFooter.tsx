import Btn from "../Btn/Btn";
import { defineComponent } from "vue";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "vue-router"

export interface AdminFooterProps {
  hideMenuBtn?: boolean
}

export default defineComponent({
  name: "AdminFooter",
  props: {
    hideMenuBtn: Boolean
  },
  setup (props: AdminFooterProps, ctx) {
    const router = useRouter()

    return () => {
      return (
        <div class={["bg-gray-900 bottom-0 fixed flex h-14 justify-end left-0 pl-2 py-2 shadow w-full z-99", !props.hideMenuBtn && "s1050:hidden"]}>
          {ctx.slots.default && ctx.slots.default()}
          {
            !props.hideMenuBtn && <Btn
              class="bg-gray-700 focus:bg-gray-600 hover:bg-gray-600 flex flex-fit h-auto items-center justify-center mr-2 px-3 py-2 rounded text-gray-300 w-auto"
              icon={faBars}
              click={() => router.replace({query: {menu: "1"}})}
            />
          }
        </div>
      )
    }
  }
})
