import { defineComponent } from "vue";


export default defineComponent({
  name: "StateLoading",
  props: {

  },
  setup (props, context) {

    return () => {
      return (
        <div class="text-center">
          Loading
        </div>
      )
    }
  }
})
