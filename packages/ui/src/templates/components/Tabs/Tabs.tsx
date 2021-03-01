import { defineComponent, PropType, Ref } from "vue";
import { RouteLocationRaw } from "vue-router";

export interface TabsTabProps {
  label: string
  to: RouteLocationRaw
}

export interface TabsProps {
  tabs: TabsTabProps[]
}

export default defineComponent({
  name: "Tabs",
  props: {
    tabs: {
      type: Array as PropType<TabsTabProps[]>,
      required: true
    }
  },
  setup (props: TabsProps) {
    return () => {
      return (
        <div class="overflow-auto relative" style="height: 50px; margin-bottom: -18px;">
          <div class="flex flex-nowrap">
            {
              props.tabs.map(tab => {
                return <div>
                  <router-link 
                    class="border-transparent text-center flex items-center s1050:h-full mr-3 s1050:mr-4 outline-none px-1 pb-1 text-gray-600 focus:text-gray-900 hover:text-gray-900 border-b-3 transition"
                    exactActiveClass="border-blue-500 font-semibold text-gray-900"
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
