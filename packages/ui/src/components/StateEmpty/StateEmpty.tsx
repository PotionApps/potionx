import { defineComponent } from "vue";


export default defineComponent({
  name: "StateEmpty",
  props: {

  },
  setup (props, context) {

    return () => {
      return (
        <div class="text-center">
          Empty
        </div>
      )
    }
  }
})
