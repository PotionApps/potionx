import { defineComponent, PropType } from "vue"
import { faAngleDoubleLeft, faAngleDoubleRight, faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from '@potionapps/utils';
import BtnSecondary from "../Btn/BtnSecondary";

export interface PaginationProps {
  count: number
  countBefore: number
  goToFirst: () => void
  goToLast: () => void
  limit: number
  next: () => void
  prev: () => void
}

export default defineComponent({
  props: {
    count: {
      required: true,
      type: Number
    },
    countBefore: {
      required: true,
      type: Number
    },
    goToFirst: {
      required: true,
      type: Function as PropType<PaginationProps['goToFirst']>
    },
    goToLast: {
      required: true,
      type: Function as PropType<PaginationProps['goToLast']>
    },
    limit: {
      required: true,
      type: Number
    },
    next: {
      required: true,
      type: Function as PropType<PaginationProps['next']>
    },
    prev: {
      required: true,
      type: Function as PropType<PaginationProps['prev']>
    }
  },
  name: "Pagination",
  setup (props: PaginationProps) {
    return () => {
      return (
        <div class="bg-white bottom-0 s1050m:bottom-8 flex items-center justify-center mt-4 s750:mt-8 pb-12 pt-2 sticky z-3">
          <div
            class={
              (props.countBefore ? "opacity-80" : "opacity-40 pointer-events-none") +
              " cursor-pointer mx-1 focus:opacity-100 hover:opacity-100 px-1 transition-opacity"
            }
            onClick={props.goToFirst}
          >
            <FontAwesomeIcon class="h-4" icon={faAngleDoubleLeft} />
          </div>
          <BtnSecondary
            class={"ml-2 mr-4"}
            click={props.prev}
            disabled={!props.countBefore}
            icon={faAngleLeft}
            label="Prev"
          />
          <span class={"font-bold text-gray-700 text-sm s450:text-base"}>
            {props.countBefore}–{Math.min(props.countBefore + props.limit, props.count)} of {props.count}
          </span>
          <BtnSecondary
            class="ml-4 mr-2"
            click={props.next}
            disabled={props.countBefore + props.limit === props.count}
            icon={faAngleRight}
            label="Next"
            reverse={true}
          />
          <div
            class={
              (props.countBefore + props.limit === props.count ? "opacity-40 pointer-events-none" : "opacity-80") +
              " cursor-pointer focus:opacity-100 hover:opacity-100 px-1 transition-opacity"
            }
            onClick={props.goToLast}
          >
            <FontAwesomeIcon class="h-4" icon={faAngleDoubleRight} />
          </div>
        </div>
      )
    }
  }
})
