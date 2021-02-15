import AdminContent from "../../layouts/AdminContent/AdminContent";
import { defineComponent } from "vue";

export default defineComponent({
  setup () {
    return () => (
      <AdminContent>
        <router-view />
      </AdminContent>
    )
  }
})