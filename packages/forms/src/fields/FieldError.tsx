import { defineComponent } from "vue";

export default defineComponent({
  setup (_, ctx) {
    return () => <p>{ctx.slots.default && ctx.slots.default()}</p>
  }
})