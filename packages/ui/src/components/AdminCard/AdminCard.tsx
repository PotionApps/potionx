import { defineComponent } from "vue";

export default defineComponent({
  name: "AdminCard",
  props: {

  },
  setup (props, context) {

    return () => {
      return (
        <div class="bg-white border-b-1 border-gray-300 cursor-pointer py-4 px-4 desktop:py-3 desktop:px-6 relative transition hover:shadow-negative-xl hover:z-2">
          {context.slots.default && context.slots.default()}
        </div>
      )
    }
  }
})
