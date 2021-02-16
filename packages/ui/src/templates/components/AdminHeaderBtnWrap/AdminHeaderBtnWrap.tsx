import { defineComponent } from "vue";

export default defineComponent((_, ctx) => 
  () => <div class="s1050m:hidden mb-3 ml-3 first:ml-0">{ctx.slots.default && ctx.slots.default()}</div>
)