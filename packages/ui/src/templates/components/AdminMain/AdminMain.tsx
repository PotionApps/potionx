import { defineComponent } from "vue";

export default defineComponent({
  name: "AdminMain",
  setup (_, ctx) {
    return () => {
      return (
        <div class="s1050m:pb-14 s1050:max-w-4/5 s1450:max-w-5/6 s1650:max-w-8/9">
          {ctx.slots.default && ctx.slots.default()}
        </div>
      )
    }
  }
})
