import AdminMain from "components/AdminMain/AdminMain";
import AdminFooter from "components/AdminFooter/AdminFooter";
import BtnMobileMenu from "components/Btn/BtnMobileMenu";
import BtnPrimary from "components/Btn/BtnPrimary";
import { defineComponent } from "vue";
import { faHome } from "@fortawesome/free-solid-svg-icons";
import { routeNames } from "root/routes/routeNames";

export default defineComponent({
  setup () {
    return () => <AdminMain class="flex items-center justify-center overflow-hidden p-6 text-center">
      <div class="relative">
        <p class="absolute font-bold left-1/2 text-gray-100 top-1/2 transform -translate-x-1/2 -translate-y-1/2" style="font-size:220px;">404</p>
        <div class="pt-6 relative z-2">
          <p class="font-semibold mb-4 text-gray-700 text-xl s450:text-2xl z-2">The page you are looking for doesn't exist.</p>
          <div class="flex justify-center">
            <BtnPrimary
              class="s1050m:hidden"
              label="Home"
              icon={faHome}
              to={{name: routeNames.home}}
            />
          </div>
        </div>
      </div>
      <AdminFooter>
        <BtnMobileMenu
          label="Home"
          icon={faHome}
          to={{name: routeNames.home}}
        />
      </AdminFooter>
    </AdminMain>
  }
})