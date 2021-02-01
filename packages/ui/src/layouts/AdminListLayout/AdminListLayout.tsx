import { defineComponent, PropType, Ref } from "vue";
import AdminFooter from "../../components/AdminFooter/AdminFooter";
import AdminSubHeader from "../../components/AdminSubHeader/AdminSubHeader";
import { PropsBtn } from "../../components/Btn/Btn";

export interface PropsAdminListLayout {
  adminFooterBtns: PropsBtn[]
}

export default defineComponent({
  name: "AdminLayout",
  props: {
    adminFooterBtns: {
      type: Object as PropType<Ref<PropsBtn[]>>,
    }
  },
  setup (props, context) {
    return () => {
      return (
        <div class="bg-gray-100 flex-1 s1050m:pb-14">
          <AdminSubHeader />
          {context.slots.default && context.slots.default()}
          <AdminFooter btns={props.adminFooterBtns} />
        </div>
      )
    }
  }
})
