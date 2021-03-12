import { defineComponent } from "vue";

export default defineComponent({
  name: "AdminForm",
  setup (_, ctx) {
    return () => {
      return (
        <form class="m-auto max-w-500 s750:pt-6 w-full">
          {ctx.slots.default && ctx.slots.default()}
        </form>
      )
    }
  }
})
