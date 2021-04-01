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
        <form class="w-full" onSubmit={props.submit}>
          {ctx.slots.default && ctx.slots.default()}
        </form>
      )
    }
  }
})
