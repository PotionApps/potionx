import { defineComponent } from "vue";

export default defineComponent({
  name: "AdminHeader",
  setup (props, context) {
    return () => {
      return (
        <div class="h-10 flex items-center justify-between relative w-full bg-gray-900 px-2">
          {context.slots.default && context.slots.default()}
        </div>
      )
    }
  }
})
