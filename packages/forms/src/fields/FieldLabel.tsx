import { defineComponent } from "vue";

export default defineComponent({
  name: "FieldLabel",
  setup (_, ctx) {
    return () => <label class="capitalize block font-semibold mb-1 ml-1 text-gray-500">
      {ctx.slots.default && ctx.slots.default()}
    </label>
  }
})