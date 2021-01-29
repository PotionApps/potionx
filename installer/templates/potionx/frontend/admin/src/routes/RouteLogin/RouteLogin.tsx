import { authFlow } from '@potion/auth'
import { defineComponent } from "vue";
import { Login } from '@potion/ui'

export default defineComponent({
  setup () {
    return () => <Login authSelect={(provider) => authFlow({provider})} />
  }
})