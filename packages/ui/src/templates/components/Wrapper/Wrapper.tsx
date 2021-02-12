import { defineComponent } from "vue";

export default defineComponent({
  props: {},
  setup (props, context) {
    return () => {
      return (
        <div class="px-4 s1050:px-8 s1450:px-12">
          {context.slots.default && context.slots.default()}
        </div>
      )
    }
  }
})
