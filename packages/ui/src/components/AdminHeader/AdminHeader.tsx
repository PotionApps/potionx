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
  props: {
    tabs: Object as PropType<Ref<AdminHeaderTabProps[]>>
  },
  setup (props, context) {
    return () => {
      return (
        <div class="bg-white border-b-1 border-gray-300 px-4 pt-3 s850:pt-4 s1050:px-8 s1450:px-12">

           {context.slots.default && context.slots.default()}

          {
            props.tabs && 
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
          } 
        </div>
      )
    }
  }
})
