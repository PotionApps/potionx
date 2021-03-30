import { defineComponent } from "vue";

export default defineComponent({
  name: "AdminHeaderBtnWrap",
  setup (props, ctx) {
    return () => {
      return (
        <div class={["mb-3 ml-3 first:ml-0"]}>
          {ctx.slots.default && ctx.slots.default()}
        </div>
      )
    }
  }
})
