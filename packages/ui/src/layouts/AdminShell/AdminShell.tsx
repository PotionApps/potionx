import AdminFooter from "../../components/AdminFooter/AdminFooter";
import AdminHeader from "../../components/AdminHeader/AdminHeader";
import { defineComponent, PropType, Ref } from "vue";
import { BtnProps } from "../../components/Btn/Btn";
import { RouteLocationRaw } from "vue-router";

export interface AdminShellProps{
  adminFooterBtns?: BtnProps[]
  adminFooterMenuRoute: RouteLocationRaw
  adminHeaderBack?: ((e?: MouseEvent) => void | RouteLocationRaw)
  adminHeaderBtns?: BtnProps[]
  adminHeaderHideBtnsMobile?: boolean
  adminHeaderSubtitle?: string
  adminHeaderTabs?: BtnProps[]
  adminHeaderTitle?: string
}

export default defineComponent({
  name: "AdminLayout",
  props: {
    adminFooterBtns: Object as PropType<Ref<BtnProps[]>>,
    adminFooterMenuRoute: {
      type: Object,
      required: true
    },
    adminHeaderBack: Function || Object,
    adminHeaderBtns: Object as PropType<Ref<BtnProps[]>>,
    adminHeaderHideBtnsMobile: Boolean,
    adminHeaderSubtitle: String,
    adminHeaderTabs: Object as PropType<Ref<BtnProps[]>>,
    adminHeaderTitle: String
  },
  setup (props, context) {
    return () => {
      return (
        <div class="max-w-screen s1050m:pb-14 s1050:max-w-4/5 s1450:max-w-5/6 s1650:max-w-8/9">
          <AdminHeader 
            back={props.adminHeaderBack}
            btns={props.adminHeaderBtns}
            hideBtnsMobile={props.adminHeaderHideBtnsMobile}
            subtitle={props.adminHeaderSubtitle}
            tabs={props.adminHeaderTabs}
            title={props.adminHeaderTitle}
          />
          {context.slots.default && context.slots.default()}
          <AdminFooter
            btns={props.adminFooterBtns}
            menuRoute={props.adminFooterMenuRoute}
          />
        </div>
      )
    }
  }
})
