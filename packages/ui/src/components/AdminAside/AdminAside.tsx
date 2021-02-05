import { defineComponent } from "vue";


export default defineComponent({
  name: "AdminAside",
  props: {

  },
  setup (props, context) {

    return () => {
      return (
        <div class="w-full s1050:max-w-200 s1050m:bg-white">
          {context.slots.default && context.slots.default()}
        </div>
      )
    }
  }
})
