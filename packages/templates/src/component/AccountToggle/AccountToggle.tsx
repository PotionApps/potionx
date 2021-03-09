import { defineComponent, ref } from "vue";
import { FontAwesomeIcon } from '@potionapps/utils';
import { faChevronCircleDown, faUser } from "@fortawesome/free-solid-svg-icons";

export default defineComponent({
  name: "AccountToggle",
  setup (_, ctx) {

    const profileName = "Natasha Grasshopper"

    const profilePicture = ""

    const menuOpen = ref(false)

    const toggleMenu = () => {
      return menuOpen.value = !menuOpen.value
    }

    return () => {
      return (
        <div class="bottom-0 sticky">
          {menuOpen.value && <div class="bg-gray-800">{ctx.slots.default && ctx.slots.default()}</div>}
          <div
            class={["bg-gray-800 focus:bg-gray-700 hover:bg-gray-700 cursor-pointer flex items-center justify-between px-2 py-3 transition w-full", menuOpen.value && "bg-gray-700"]}
            onClick={toggleMenu}
          >
            <div class="flex items-center">
              {
                profilePicture ? <img class="flex-fit h-7 object-cover mr-2 rounded-full w-7" src={profilePicture} /> :
                <div class="bg-gray-400 flex flex-fit h-7 items-center justify-center mr-2 rounded-full text-gray-600 text-sm w-7">
                  <FontAwesomeIcon icon={faUser} />
                </div>
              }
              <p class="font-semibold text-gray-300 text-sm">{profileName}</p>
            </div>
            <FontAwesomeIcon class={["duration-200 ease-in-out text-lg text-gray-400 transform", menuOpen.value && "-rotate-180"]} icon={faChevronCircleDown} />
          </div>
        </div>
      )
    }
  }
})