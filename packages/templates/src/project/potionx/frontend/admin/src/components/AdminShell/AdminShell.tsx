import { defineComponent } from "vue";

export default defineComponent({
  name: "AdminShell",
  setup (_, ctx) {
    return () => {
      return (
        <div class="s1050:flex max-w-screen min-h-screen relative">
          {ctx.slots.default && ctx.slots.default()}
        </div>
      )
    }
  }
})
