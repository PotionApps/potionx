import { defineComponent } from "vue";

export default defineComponent({
  name: "FieldError",
  setup (_, ctx) {
    return () => <p class='text-red-600 text-sm'>{ctx.slots.default && ctx.slots.default()}</p>
  }
})