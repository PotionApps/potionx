import { defineComponent } from "vue";

export default defineComponent({
  setup (_, ctx) {
    return () => <label>{ctx.slots.default && ctx.slots.default()}</label>
  }
})