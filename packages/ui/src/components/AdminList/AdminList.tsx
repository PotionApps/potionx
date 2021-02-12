import { defineComponent } from "vue"

export default defineComponent({
  props: {},
  setup (props, context) {

    return () => {
      return (
        <div class="border-gray-300 border-t-1 overflow-hidden s750:border-l-1 s750:border-r-1 s750m:-mx-4 s750:rounded-md s750:shadow-md">
          {context.slots.default && context.slots.default()}
        </div>
      )
    }
  }
})
