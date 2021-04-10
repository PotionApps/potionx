import AdminFooter from "components/AdminFooter/AdminFooter";
import BtnMobileMenu from "components/Btn/BtnMobileMenu";
import { defineComponent, computed } from "vue";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "vue-router"

export default defineComponent({
  setup (_, ctx) {
    const router = useRouter()

    // This handles the previous page logic
    const mobileBtns = computed(() => [
      {
        click:() => {
          const query: any = {...router.currentRoute.value.query}
          delete query.menu
          router.replace({
            query
          })
        },
        icon: faArrowLeft,
        label: "Back"
      }
    ])

    return () => <div class="bg-gray-800 min-h-screen s1050m:pb-14 w-full">
      {ctx.slots.default && ctx.slots.default()}
      <AdminFooter>
        {
          mobileBtns.value.map(btn => {
            return <BtnMobileMenu {...btn} />
          })
        }
      </AdminFooter>
    </div>
  }
})