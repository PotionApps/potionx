import { defineComponent } from "vue";

export default defineComponent({
  name: "AdminBody",
  setup (_, ctx) {
    return () => {
      return (
        <div class="px-4 py-6 s1050:px-8 s1450:px-12">
          {ctx.slots.default && ctx.slots.default()}
        </div>
      )
    }
  }
})
