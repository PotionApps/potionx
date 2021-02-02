import Bars from "../../assets/bars.svg";
import Btn, { PropsBtn } from "../Btn/Btn";
import { defineComponent, PropType, Ref } from "vue";
import { RouteLocationRaw } from "vue-router";

export interface PropsAdminFooter {
  btns?: PropsBtn[],
  hideMenu?: boolean,
  menuRoute: RouteLocationRaw
}

export default defineComponent({
  name: "AdminFooter",
  props: {
    btns: Object as PropType<Ref<PropsBtn[]>>,
    hideMenu: Boolean,
    menuRoute: {
      type: Object,
      required: true
    }
  },
  setup (props, context) {

    return () => {
      return (
        <div class="bg-gray-900 bottom-0 justify-end h-14 left-0 fixed w-full z-99 py-2 px-2 flex shadow desktop:hidden">
          {
           props.btns && props.btns.value.map(btn => {
              return <Btn
                class="bg-gray-700 text-base text-gray-300 hover:bg-gray-600 mr-2 w-full font-semibold"
                icon={btn.icon}
                label={btn.label}
                noStyle={true}
              />
            })
          }
          {context.slots.default && context.slots.default()}
          {
            !props.hideMenu && <Btn
              class={["bg-gray-700", "hover:bg-gray-600", props.btns ? "flex-fit" : "flex-full"]}
              icon={Bars}
              to={props.menuRoute}
            />
          }
        </div>
      )
    }
  }
})
