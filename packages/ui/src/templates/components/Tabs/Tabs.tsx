import { defineComponent, PropType, Ref } from "vue";
import { RouteLocationRaw } from "vue-router";

export interface AdminHeaderTabProps {
  label: string
  to: RouteLocationRaw
}

export interface AdminHeaderProps {
  tabs: AdminHeaderTabProps[]
}

export default defineComponent({
  props: {
    tabs: {
      type: Object as PropType<Ref<AdminHeaderTabProps[]>>,
      required: true
    }
  },
  setup (props, context) {
    return () => {
      return (
        <div class="overflow-auto relative" style="height: 50px; margin-bottom: -18px;">
          <div class="flex flex-nowrap">
            {
              props.tabs.value.map(tab => {
                return <div>
                  <router-link 
                    class="flex items-center text-center mr-3 s1050:h-full s1050:mr-4 outline-none px-1 pb-1 text-gray-600 hover:text-gray-900 border-b-3 border-transparent transition"
                    exactActiveClass="text-gray-900 font-semibold border-blue-500"
                    to={tab.to}
                  >
                    <span class="whitespace-nowrap">{tab.label}</span>
                  </router-link>
                </div>
              })
            }
          </div>
        </div>
      )
    }
  }
})
