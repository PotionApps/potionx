import { defineComponent } from "vue";

export default defineComponent((_, ctx) => 
  () => <div class="s1050m:hidden mb-2 mr-2">{ctx.slots.default && ctx.slots.default()}</div>
)