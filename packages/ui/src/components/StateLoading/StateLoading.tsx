import { defineComponent } from "vue";
import "./StateLoading.css";

export default defineComponent({
  name: "StateLoading",
  setup () {
    return () => {
      return (
        <div class="mx-auto lds-ellipsis">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      )
    }
  }
})
