import { defineComponent } from "vue";
import LoginError from 'root/components/LoginError/LoginError'

export default defineComponent({
  setup () {
    return () => <LoginError />
  }
})