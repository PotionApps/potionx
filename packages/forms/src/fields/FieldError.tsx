import { defineComponent } from "vue";

export default defineComponent({
  setup (_, ctx) {
    return () => <p class='text-red-600 text-sm'>{ctx.slots.default && ctx.slots.default()}</p>
  }
})