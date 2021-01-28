import { defineComponent, computed } from "vue";
import AdminLayout from "../../components/AdminLayout/AdminLayout";

export default defineComponent({
  setup () {
    const nav = computed(() => [
      {
        label: "Home"
      }
    ])
    return () => <AdminLayout nav={nav}>
      <h1 class="text-gray-800 text-2xl mb-8">admin</h1>
    </AdminLayout>
  }
})