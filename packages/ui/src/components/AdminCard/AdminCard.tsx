import { defineComponent } from "vue";

export default defineComponent({
  name: "AdminCard",
  props: {

  },
  setup (props, context) {

    return () => {
      return (
        <div class="bg-white border-b-1 border-gray-300 cursor-pointer py-4 px-4 s1050:py-3 s1050:px-6 relative transition hover:shadow-negative-xl hover:z-2">
          {context.slots.default && context.slots.default()}
        </div>
      )
    }
  }
})
