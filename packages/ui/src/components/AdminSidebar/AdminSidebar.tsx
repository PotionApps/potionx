import { defineComponent } from "vue";

export default defineComponent({
  name: "AdminSidebar",
  setup (props, context) {
    return () => {
      return (
        <div class="bg-gray-900 top-0 flex flex-col flex-fit h-screen px-3 py-4 sticky w-full s1050:max-w-1/5 s1450:max-w-1/6 s1450:px-4 s1650:max-w-1/9">
          {context.slots.default && context.slots.default()}
        </div>
      )
    }
  }
})