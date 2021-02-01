import { defineComponent } from "vue";
import PotionLogo from '../../assets/potion-logo.svg'
import AdminListLayout from "../../layouts/AdminListLayout/AdminListLayout";

export default defineComponent({
  setup () {

    return () => <AdminListLayout
      v-slots={{
        logo: () => <img class="w-4" src={PotionLogo}/>
      }}
    >
      <h1 class="text-gray-800 text-2xl mb-8">admin</h1>
    </AdminListLayout>
  }
})