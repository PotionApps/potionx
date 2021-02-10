import BtnPrimary from "../Btn/BtnPrimary";
import { defineComponent } from "vue"
import { faAngleDoubleLeft, faAngleDoubleRight, faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "../../../src/fontawesomeTypeFix"

export interface PaginationProps {
  
}

export default defineComponent({
  setup () {
    return () => {
      return (
        <div class="flex items-center justify-center sticky bottom-0">
          <div class={["cursor-pointer", "mx-1", "opacity-40", "px-1", "pointer-events-none", "transition-opacity", "hover:opacity-100"]}>
            <FontAwesomeIcon class="h-4" icon={faAngleDoubleLeft} />
          </div>
          <BtnPrimary
            class="ml-2 mr-4"
            click={() => {}}
            disabled={true}
            icon={faAngleLeft}
            label="Prev"
          />
          <span class={"font-bold text-gray-700 text-sm s450:text-base"}>80/107</span>
          <BtnPrimary
            class="ml-4 mr-2"
            click={() => {}}
            icon={faAngleRight}
            label="Next"
            reverse={true}
          />
          <div class={["cursor-pointer", "opacity-80", "px-1", "transition-opacity", "hover:opacity-100"]}>
            <FontAwesomeIcon class="h-4" icon={faAngleDoubleRight} />
          </div>
        </div>
      )
    }
  }
})
