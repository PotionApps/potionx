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
  name: "Tabs",
  props: {
    tabs: {
      type: Object as PropType<Ref<AdminHeaderTabProps[]>>,
      required: true
    }
  },
  setup (props) {
    return () => {
      return (
        <div class="overflow-auto relative" style="height: 50px; margin-bottom: -18px;">
          <div class="flex flex-nowrap">
            {
              props.tabs.value.map(tab => {
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
