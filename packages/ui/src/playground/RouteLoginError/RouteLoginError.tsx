import { defineComponent } from "vue";
import LoginError from "../../templates/components/LoginError/LoginError";

export default defineComponent({
  setup () {
    return () => <LoginError />
  }
})