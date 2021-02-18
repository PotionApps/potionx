import { defineComponent, ref } from "vue";
import { FontAwesomeIcon } from '@potionapps/utils';
import { faChevronCircleDown, faChevronDown, faUser } from "@fortawesome/free-solid-svg-icons";
import SidebarNavItem, { SidebarNavItemProps } from '../SidebarNavItem/SidebarNavItem';

export interface AdminAccountProps {
  image: string,
  name: string,
  nav: SidebarNavItemProps[]
}

export default defineComponent({
  name: "AdminAccount",
  props: {
    image: String,
    name: String,
    nav: {
      type: Object,
      required: true
    }
  },
  setup (props, ctx) {
    const menuOpen = ref(false)

    const toggleMenu = () => {
      return menuOpen.value = !menuOpen.value
    }

    return () => {
      return (
        <div class="bottom-0 sticky">
          <div
            class="bg-gray-800 cursor-pointer flex items-center justify-between px-4 py-3 transition w-full hover:bg-gray-700"
            onClick={toggleMenu}
          >
            <div class="flex items-center">
              {
                props.image ? <img class="flex-fit h-7 object-cover mr-2 rounded-full w-7" src={props.image} /> :
                <div class="bg-gray-400 flex flex-fit h-7 items-center justify-center mr-2 rounded-full text-gray-600 text-sm w-7">
                  <FontAwesomeIcon icon={faUser} />
                </div>
              }
              <p class="text-gray-100 text-sm">{props.name}</p>
            </div>
            <FontAwesomeIcon class={["duration-200 ease-in-out text-lg text-gray-400 transform", menuOpen.value && "-rotate-180"]} icon={faChevronCircleDown} />
          </div>
          {menuOpen.value && <div>
            {
              props.nav.value.map((i : any) => {
                return <SidebarNavItem {...i} />
              })
            }  
          </div>}
        </div>
      )
    }
  }
})