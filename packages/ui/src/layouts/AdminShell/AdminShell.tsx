import { defineComponent } from "vue";

export default defineComponent({
  props: {},
  setup (props, context) {
    return () => {
      return (
        <div class="flex min-h-screen max-w-screen relative">
          {context.slots.default && context.slots.default()}
        </div>
      )
    }
  }
})
