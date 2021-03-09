import { defineComponent } from "vue";

export default defineComponent({
  name: "Wrapper",
  setup (_, ctx) {
    return () => {
      return (
        <div class="px-4 s1050:px-8 s1450:px-12">
          {ctx.slots.default && ctx.slots.default()}
        </div>
      )
    }
  }
})
