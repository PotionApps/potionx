import { defineComponent } from "vue";
import Login from "../../templates/components/Login/Login";

export default defineComponent({
  setup () {
    return () => <Login authSelect={(s) => null} />
  }
})