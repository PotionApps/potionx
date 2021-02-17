import { defineComponent } from "vue";

export default defineComponent({
  props: {},
  setup (props, context) {
    return () => {
      return (
        <div class="max-w-screen s1050m:pb-14 s1050:max-w-4/5 s1450:max-w-5/6 s1650:max-w-8/9">
          {context.slots.default && context.slots.default()}
        </div>
      )
    }
  }
})
