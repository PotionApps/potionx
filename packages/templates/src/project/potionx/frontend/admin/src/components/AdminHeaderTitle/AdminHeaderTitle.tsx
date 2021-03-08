import { defineComponent } from "vue";

export default defineComponent({
  name: "AdminHeaderTitle",
  setup (_, ctx) {
    return () => {
      return (
        <h1 class="font-semibold text-gray-900 text-xl">
          {ctx.slots.default && ctx.slots.default()}
        </h1>
      )
    }
  }
})
