import { defineComponent, PropType } from "vue";

export interface AdminFormProps {
  submit: () => any
}

export default defineComponent({
  name: "AdminForm",
  props: {
    submit: {
      type: Function as PropType<() => any>,
      required: true
    }
  },
  setup (props: AdminFormProps, ctx) {
    return () => {
      return (
        <form class="m-auto max-w-500 s750:pt-6 w-full" onSubmit={props.submit}>
          {ctx.slots.default && ctx.slots.default()}
        </form>
      )
    }
  }
})
