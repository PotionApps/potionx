import { defineComponent } from "vue";

export default defineComponent({
  setup (_, ctx) {
    return () => <label class="text-gray-700">
      {ctx.slots.default && ctx.slots.default()}
    </label>
  }
})