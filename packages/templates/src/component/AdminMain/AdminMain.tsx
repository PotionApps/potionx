import { defineComponent } from "vue";

export default defineComponent({
  name: "AdminMain",
  setup (_, ctx) {
    return () => {
      return (
        <div class="bg-white s1050m:pb-14 min-w-0 w-full flex flex-col">
          {ctx.slots.default && ctx.slots.default()}
        </div>
      )
    }
  }
})