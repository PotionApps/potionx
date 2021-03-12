import { defineComponent, ref } from "vue";
import { FontAwesomeIcon } from '@potionapps/utils';
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";

export interface DropdownProps {
  label: string
}

export default defineComponent({
  name: "Dropdown",
  props: {
    label: {
      type: String,
      required: true
    }
  },
  setup (props: DropdownProps, ctx) {
    const dropdownActive = ref(false);

    const toggleMenu = () => {
      dropdownActive.value = !dropdownActive.value
    }

    return () => {
      return (
        <div class="relative">
          <div 
            class={["bg-white border-1 border-gray-300 cursor-pointer inline-flex items-center p-2 px-4 rounded-md  focus:text-gray-500 hover:text-gray-500 transition", dropdownActive.value ? "text-gray-500" : "text-gray-800"]}
            onClick={toggleMenu} 
          >
            <span>{props.label}</span>
            <FontAwesomeIcon class="ml-2 text-xs" icon={faChevronDown} />
          </div>
          <div class={["absolute bg-white border border-gray-200 mt-2 origin-top-right outline-none right-0 rounded-md shadow-lg transform transition w-56", dropdownActive.value ? "opacity-100 scale-100" : "opacity-0 scale-95"]}>
              {ctx.slots.default && ctx.slots.default()}
            </div> 
        </div>
      )
    }
  }
})
