import { defineComponent } from "vue";

export default defineComponent({
  name: "AdminMain",
  setup (_, ctx) {
    return () => {
      return (
        <div class="bg-white min-h-screen s1050m:pb-14 min-w-0">
          {ctx.slots.default && ctx.slots.default()}
        </div>
      )
    }
  }
})
