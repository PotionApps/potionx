import AdminFooter from "../../components/AdminFooter/AdminFooter";
import AdminSubHeader from "../../components/AdminSubHeader/AdminSubHeader";
import { defineComponent, PropType, Ref } from "vue";
import { BtnProps } from "../../components/Btn/Btn";
import { RouteLocationRaw } from "vue-router";

export interface PropsAdminListLayout {
  adminFooterBtns?: BtnProps[]
  adminFooterMenuRoute: RouteLocationRaw
  adminSubHeaderBack?: ((e?: MouseEvent) => void | RouteLocationRaw)
  adminSubHeaderBtns?: BtnProps[]
  adminSubHeaderHideBtnsMobile?: boolean
  adminSubHeaderSubtitle?: string
  adminSubHeaderTabs?: BtnProps[]
  adminSubHeaderTitle?: string
}

export default defineComponent({
  name: "AdminLayout",
  props: {
    adminFooterBtns: Object as PropType<Ref<BtnProps[]>>,
    adminFooterMenuRoute: {
      type: Object,
      required: true
    },
    adminSubHeaderBack: Function || Object,
    adminSubHeaderBtns: Object as PropType<Ref<BtnProps[]>>,
    adminSubHeaderHideBtnsMobile: Boolean,
    adminSubHeaderSubtitle: String,
    adminSubHeaderTabs: Object as PropType<Ref<BtnProps[]>>,
    adminSubHeaderTitle: String
  },
  setup (props, context) {
    return () => {
      return (
        <div class="desktopm:pb-14">
          <AdminSubHeader 
            back={props.adminSubHeaderBack}
            btns={props.adminSubHeaderBtns}
            hideBtnsMobile={props.adminSubHeaderHideBtnsMobile}
            subtitle={props.adminSubHeaderTitle}
            tabs={props.adminSubHeaderTabs}
            title={props.adminSubHeaderSubtitle}
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
