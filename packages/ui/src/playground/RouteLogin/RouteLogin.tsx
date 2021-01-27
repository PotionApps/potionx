import { defineComponent } from "vue";
import Login from "../../components/Login/Login";

export default defineComponent({
  setup () {
    return () => <Login authSelect={(s) => null} />
  }
})