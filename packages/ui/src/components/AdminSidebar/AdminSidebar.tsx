import { defineComponent } from "vue";

export default defineComponent({
  name: "AdminSidebar",
  setup (props, context) {
    return () => {
      return (
        <div class="bg-gray-900 flex flex-col h-screen max-w-150 px-3 py-4 relative w-full s1450:max-w-200 s1450:px-4">
          {context.slots.default && context.slots.default()}
          <div class="flex flex-1 flex-col justify-between">
            {context.slots.navPrimary && context.slots.navPrimary()}
            {context.slots.navSecondary && context.slots.navSecondary()}
          </div>
        </div>
      )
    }
  }
})
