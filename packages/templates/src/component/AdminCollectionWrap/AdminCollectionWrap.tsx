import { defineComponent } from "vue";

export default defineComponent({
  setup (_, ctx) {
    return () => {
      return <div class='flex flex-col flex-grow justify-between'>
        {ctx.slots.default && ctx.slots.default()}
      </div>
    }
  }
})