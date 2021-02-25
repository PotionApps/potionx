import { defineComponent } from "vue";

export default defineComponent({
  name: "AdminHeaderBtnWrap",
  setup (_, ctx) {
    return () => {
      return (
        <div class="ml-3 first:ml-0">
          {ctx.slots.default && ctx.slots.default()}
        </div>
      )
    }
  }
})
