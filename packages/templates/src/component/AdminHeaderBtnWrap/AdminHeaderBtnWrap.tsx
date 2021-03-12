import { defineComponent } from "vue";

export interface AdminHeaderBtnWrapProps {
  hidden?: boolean
}

export default defineComponent({
  name: "AdminHeaderBtnWrap",
  props: {
    hidden: Boolean
  },
  setup (props: AdminHeaderBtnWrapProps, ctx) {
    return () => {
      return (
        <div class={["mb-3 ml-3 first:ml-0", props.hidden && "s1050m:hidden"]}>
          {ctx.slots.default && ctx.slots.default()}
        </div>
      )
    }
  }
})
