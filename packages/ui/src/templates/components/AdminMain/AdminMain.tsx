import { defineComponent } from "vue";

export default defineComponent({
  name: "AdminMain",
  setup (_, ctx) {
    return () => {
      return (
        <div class="s1050m:pb-14 min-h-screen">
          {ctx.slots.default && ctx.slots.default()}
        </div>
      )
    }
  }
})
