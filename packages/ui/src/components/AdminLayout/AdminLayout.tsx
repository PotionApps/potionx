import { defineComponent, PropType, Ref } from "vue";
import { routeNames } from "../../playground/routeNames";
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
    const btns = [
      {
        label: "Account",
        to: {
          name: routeNames.login
        }
      },
      {
        click: () => {},
        label: "Log Out"
      }
    ]
    return () => {
      return (
        <div class="bg-white min-h-screen w-full">
          <AdminHeader class="s1050m:hidden">
            {context.slots.logo && context.slots.logo()}
            <AdminHeaderNav nav={props.nav} />
            <AdminHeaderAccount 
              btns={btns}
              initials="vr"
            />
          </AdminHeader>
          {context.slots.default && context.slots.default()}
        </div>
      )
    }
  }
})
