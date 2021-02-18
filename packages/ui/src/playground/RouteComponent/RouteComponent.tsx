import AdminMain from "../../templates/components/AdminMain/AdminMain";
import { defineComponent } from "vue";

export default defineComponent({
  setup () {
    return () => (
      <AdminMain>
        <router-view />
      </AdminMain>
    )
  }
})