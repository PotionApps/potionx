import { defineComponent } from "vue";

export default defineComponent({
  name: "FieldError",
  setup (_, ctx) {
    return () => <p class='ml-1 mt-1 text-red-600 text-xs'>{ctx.slots.default && ctx.slots.default()}</p>
  }
})