import { defineComponent, PropType, Ref } from "vue";
import AdminHeader from "../../components/AdminHeader/AdminHeader";
import AdminHeaderAccount from "../../components/AdminHeaderAccount/AdminHeaderAccount";
import AdminHeaderNav, { AdminBarNavItem } from "../../components/AdminHeaderNav/AdminHeaderNav";

export default defineComponent({
  name: "AdminLayout",
  props: {
    nav: {
      type: Object as PropType<Ref<AdminBarNavItem[]>>,
      required: true
    }
  },
  setup (props, context) {
    return () => {
      return (
        <div class="bg-white min-h-screen w-full">
          <AdminHeader class="s1050m:hidden">
            <AdminHeaderNav nav={props.nav} />
            <AdminHeaderAccount 
              btns={[]}
              initials="vr"
            />
          </AdminHeader>
          {context.slots.default && context.slots.default()}
        </div>
      )
    }
  }
})
