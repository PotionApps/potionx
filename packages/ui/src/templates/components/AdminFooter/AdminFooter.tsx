import { defineComponent } from "vue";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@potionapps/utils";
import { routeNames } from 'root/routes/routeNames'

export interface PropsAdminFooter {
  hideMenu?: boolean
}

export default defineComponent({
  name: "AdminFooter",
  props: {
    hideMenu: Boolean
  },
  setup (props, context) {

    return () => {
      return (
        <div class="bg-gray-900 bottom-0 justify-end h-14 left-0 fixed w-full z-99 py-2 px-2 flex shadow s1050:hidden">
          {context.slots.default && context.slots.default()}
          {
            !props.hideMenu && <router-link
              class="bg-gray-700 flex flex-fit h-auto items-center justify-center px-3 py-2 rounded text-gray-300 w-auto hover:bg-gray-600"
              to={{name: routeNames.menu}}
            >
              <FontAwesomeIcon icon={faBars} />
            </router-link>
          }
        </div>
      )
    }
  }
})
