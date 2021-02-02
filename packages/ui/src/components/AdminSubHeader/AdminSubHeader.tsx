import { defineComponent, PropType, Ref } from "vue";
import Back from '../../assets/back.svg'
import Btn, { PropsBtn } from "../Btn/Btn";
import { RouteLocationRaw } from "vue-router";

export type PropsAdminSubHeaderBreadcrumb = {
  to: (string | RouteLocationRaw)
  label: string
}

export interface PropsAdminSubHeader {
  back?: ((e?: MouseEvent) => void | RouteLocationRaw),
  breadcrumbs?: PropsAdminSubHeaderBreadcrumb[]
  btns?: PropsBtn[]
  hideBtnsMobile?: boolean
  subtitle?: String
  tabs?: PropsBtn[]
  title?: string
}

export default defineComponent({
  name: "AdminSubHeader",
  props: {
    back: Function || Object,
    btns: Object as PropType<Ref<PropsBtn[]>>,
    hideBtnsMobile: Boolean,
    subtitle: String,
    tabs: Object as PropType<Ref<PropsBtn[]>>,
    title: String
  },
  setup (props, context) {
    return () => {
      return (
        <div class={["bg-white", "border-b-1", "border-gray-300", "flex", "pl-2", "desktop:items-center", "desktop:justify-between", "desktop:h-16", "desktop:px-2", "desktopm:flex-col"]}>
          <div class={["flex", "items-center", "order-1", "pr-2", "desktopm:mb-2", props.tabs && "desktop:flex-quarter", !props.tabs && "desktop:flex-half"]}>
            {
              props.back && <Btn 
                class="bg-gray-200 hover:bg-gray-300 mr-2 rounded-3xl desktopm:hidden p-2 "
                icon={Back}
                noStyle={true}
              />
            }
            <div>
              <p class="text-gray-900 text-xl">{props.title}</p>
              <span class="text-gray-600 text-sm">{props.subtitle}</span>
            </div>
          </div>
          {
            props.tabs && 
            <div class="desktopm:overflow-auto order-3 desktop:order-2 desktop:flex-half desktopm:h-14 desktopm:-mb-6 relative desktop:h-full">
              <div class="flex desktop:justify-center h-full">
                {
                  props.tabs.value.map((tab: PropsBtn) => {
                    return <div class="desktop:h-full">
                      <router-link 
                        class="flex items-center text-center mr-3 desktop:h-full desktop:mx-2 px-1 desktopm:pb-1 text-gray-600 hover:text-gray-900 border-b-3 border-transparent transition"
                        exactActiveClass="text-gray-900 font-semibold border-gray-900"
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
          <div class={["flex", "order-2", "desktop:order-3", props.tabs && "desktopm:mb-1", "desktop:justify-end", props.tabs && "desktop:flex-quarter", !props.tabs && "desktop:flex-half", props.hideBtnsMobile && "desktopm:hidden"]}>
            {context.slots.buttons && context.slots.buttons()}
            <div class="desktopm:overflow-auto desktopm:h-12">
              <div class="flex desktopm:flex-row-reverse desktop:justify-end desktop:h-full">
                {
                  props.btns?.value.map((btn: PropsBtn) => {
                    return <Btn
                      class="py-2 px-2 text-xs rounded-base font-semibold bg-gray-200 desktopm:mr-2 desktop:ml-2"
                      click={btn.click}
                      icon={btn.icon}
                      label={btn.label}
                      to={btn.to}
                      noStyle={true}
                    />
                  })
                }
              </div>
            </div>
          </div>
        </div>
      )
    }
  }
})
