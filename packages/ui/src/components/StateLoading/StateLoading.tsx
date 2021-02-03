import { defineComponent } from "vue";
import "./StateLoading.css";

export default defineComponent({
  name: "StateLoading",
  props: {

  },
  setup (props, context) {

    return () => {
      return (
        <div>
          <div class="mx-auto lds-ellipsis"><div></div><div></div><div></div><div></div></div>
        </div>
      )
    }
  }
})
