import { defineComponent } from "vue";
import PotionLogo from '../../assets/potion-logo.svg'

export default defineComponent({
  name: "AdminHeader",
  setup (props, context) {
    return () => {
      return (
        <div class="h-10 flex items-center justify-between relative w-full bg-gray-900 px-2">
          <img class="w-4" src={PotionLogo} />
          {context.slots.default && context.slots.default()}
        </div>
      )
    }
  }
})
