import { defineComponent, computed } from "vue";
import AdminLayout from "../../components/AdminLayout/AdminLayout";
import PotionLogo from '../../assets/potion-logo.svg'

export default defineComponent({
  setup () {
    const nav = computed(() => [
      {
        label: "Home"
      }
    ])
    return () => <AdminLayout
      nav={nav}
      v-slots={{
        logo: () => <img class="w-4" src={PotionLogo}/>
      }}
    >
      <h1 class="text-gray-800 text-2xl mb-8">admin</h1>
    </AdminLayout>
  }
})