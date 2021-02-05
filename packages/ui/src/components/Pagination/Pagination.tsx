import Btn, { BtnProps } from "../../components/Btn/Btn"
import ChevronLeft from "../../assets/chevron-left.svg"
import ChevronRight from "../../assets/chevron-right.svg"
import ChevronLeftDouble from "../../assets/chevron-left-double.svg"
import ChevronRightDouble from "../../assets/chevron-right-double.svg"
import { defineComponent } from "vue";

export interface PaginationProps {

}

export default defineComponent({
  name: "Pagination",
  props: {

  },
  setup (props, context) {

    return () => {
      return (
        <div class="flex items-center justify-center sticky bottom-0">
          <div class={["cursor-pointer", "mx-1", "opacity-40", "px-1", "pointer-events-none", "transition-opacity", "hover:opacity-100"]}>
            <img class="h-4" src={ChevronLeftDouble} />
          </div>
          <Btn 
            class={["bg-gray-300", "hover:bg-gray-400", "ml-2", "mr-4", "s750:text-lg"]}
            click={() => {}}
            disabled={true}
            image={ChevronLeft}
            label="Prev"
          />
          <span class={"font-bold text-gray-700 text-sm s450:text-base s750:text-lg"}>80/107</span>
          <Btn 
            class={["bg-gray-300", "hover:bg-gray-400", "ml-4", "mr-2", "s750:text-lg"]}
            click={() => {}}
            image={ChevronRight}
            label="Next"
            reverse={true}
          />
          <div class={["cursor-pointer", "opacity-80", "px-1", "transition-opacity", "hover:opacity-100"]}>
            <img class="h-4" src={ChevronRightDouble} />
          </div>
        </div>
      )
    }
  }
})
