import { defineComponent, PropType, Ref } from "vue";
import { RouteLocationRaw } from "vue-router";

export interface AdminHeaderTabProps {
  label: string
  to: RouteLocationRaw
}

export interface AdminHeaderProps {
  tabs?: AdminHeaderTabProps[]
}

export default defineComponent({
  name: "AdminHeader",
  props: {
    tabs: Object as PropType<Ref<AdminHeaderTabProps[]>>
  },
  setup (props, ctx) {
    return () => {
      return (
        <div class="bg-white border-b-1 border-gray-300 pt-3">
          <div class="px-4 s1050:px-8 s1450:px-12">
            <div class="flex s1050m:flex-wrap items-center justify-between">
              <div class="flex flex-full items-center s1050:max-w-500 s1450:max-w-600 pb-3 pr-2">
                {ctx.slots.default && ctx.slots.default()}
              </div>
              {ctx.slots.btns && <div class="flex">{ctx.slots.btns()}</div>}
            </div>
          </div>
        </div>
      )
    }
  }
})
