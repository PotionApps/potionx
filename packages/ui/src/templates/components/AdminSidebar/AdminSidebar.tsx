import { defineComponent } from "vue";

export default defineComponent({
  name: "AdminSidebar",
  setup (_, ctx) {
    return () => {
      return (
        <div class="bg-gray-900 flex-fit s1050m:hidden s1050:max-w-1/5 s1450:max-w-1/6 s1650:max-w-1/9 relative w-full z-1">
          {ctx.slots.default && ctx.slots.default()}
        </div>
      )
    }
  }
})