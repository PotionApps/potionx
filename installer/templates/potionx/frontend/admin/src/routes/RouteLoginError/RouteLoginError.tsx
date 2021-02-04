import { defineComponent } from "vue";
import { LoginError } from '@potionapps/ui'

export default defineComponent({
  setup () {
    return () => <LoginError />
  }
})