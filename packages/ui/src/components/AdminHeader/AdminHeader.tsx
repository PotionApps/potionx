import Back from '../../assets/back.svg'
import Btn, { BtnProps } from "../Btn/Btn";
import { defineComponent, PropType, Ref } from "vue";
import { RouteLocationRaw } from "vue-router";

export interface AdminHeaderBtnProps extends BtnProps {
  hideBtnMobile?: boolean
}

export interface AdminHeaderTabProps extends BtnProps {

}

export interface AdminHeaderProps {
  back?: ((e?: MouseEvent) => void | RouteLocationRaw),
  btns?: AdminHeaderBtnProps[]
  subtitle?: String
  tabs?: AdminHeaderTabProps[]
  title?: string
}

export default defineComponent({
  name: "AdminHeader",
  props: {
    back: Function || Object,
    btns: Object as PropType<Ref<AdminHeaderBtnProps[]>>,
    subtitle: String,
    tabs: Object as PropType<Ref<AdminHeaderTabProps[]>>,
    title: String
  },
  setup (props, context) {
    return () => {
      return (
        <div class="bg-white border-b-1 border-gray-300 px-4 pt-4 s850:pt-6 s1050:px-8 s1450:px-12">
          <div class="flex items-start justify-between pr-4 s1050m:flex-wrap s1050:pr-0">

            <div class={["flex", "flex-full", "items-center", "mb-2"]}>
              {props.back && <Btn 
                class="mr-2 s1050m:hidden"
                image={Back}
              />}
              <div class="s1050:max-w-500 s1450:max-w-600">
                <p class="font-semibold text-gray-900 text-xl">{props.title || "Untitled"}</p>
                <span class="text-gray-600 text-sm">{props.subtitle}</span>
              </div>
              {context.slots.content && context.slots.content()}
            </div>

            <div class="flex s1050m:flex-wrap">
              {context.slots.buttons && context.slots.buttons()}
              <div class="flex flex-wrap s1050:justify-end">
                {props.btns?.value.map(btn => {
                  return <Btn
                    bg={btn.bg}
                    bgHover={btn.bgHover}
                    color={btn.color}
                    colorHover={btn.colorHover}
                    class={["mb-2 s1050m:mr-2 s1050:ml-2", btn.hideBtnMobile && "s1050m:hidden"]}
                    click={btn.click}
                    fontSize="text-xs"
                    image={btn.image}
                    label={btn.label}
                    padding="p-2"
                    to={btn.to}
                />})}
              </div>
            </div>
          </div>

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
