import { defineComponent } from "vue";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import Btn from "../Btn/Btn";
import { routeNames } from 'root/routes/routeNames'

export interface PropsAdminFooter {
  hideMenu?: boolean
}

export default defineComponent({
  name: "AdminFooter",
  props: {
    hideMenu: Boolean
  },
  setup (props, ctx) {
    return () => {
      return (
        <div class="bg-gray-900 bottom-0 fixed flex h-14 s1050:hidden justify-end left-0 pl-2 py-2 shadow w-full z-99">
          {ctx.slots.default && ctx.slots.default()}
          {
            !props.hideMenu && <Btn
              class="bg-gray-700 focus:bg-gray-600 hover:bg-gray-600 flex flex-fit h-auto items-center justify-center mr-2 px-3 py-2 rounded text-gray-300 w-auto"
              icon={faBars}
              to={
                {
                  query: {
                    menu: "1"
                  }
                }
              }
            />
          }
        </div>
      )
    }
  }
})
