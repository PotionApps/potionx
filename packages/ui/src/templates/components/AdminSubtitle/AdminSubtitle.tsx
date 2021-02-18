import { defineComponent } from "vue";

export default defineComponent({
  name: "AdminSubtitle",
  setup (_, ctx) {
    return () => {
      return (
        <span class="text-gray-600 text-sm">
          {ctx.slots.default && ctx.slots.default()}
        </span>
      )
    }
  }
})
