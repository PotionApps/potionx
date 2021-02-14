import { defineComponent } from "vue";

export default defineComponent((_, ctx) => 
  () => <span class="text-gray-600 text-sm">
    {ctx.slots.default && ctx.slots.default()}
  </span>
)