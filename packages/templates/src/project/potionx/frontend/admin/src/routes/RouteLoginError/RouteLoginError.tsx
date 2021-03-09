import { defineComponent } from "vue";
import LoginError from 'components/LoginError/LoginError'

export default defineComponent({
  setup () {
    return () => <LoginError />
  }
})