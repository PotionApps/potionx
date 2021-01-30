import { signIn } from 'shared/signIn'
import { defineComponent } from "vue";
import { Login } from '@potion/ui'

export default defineComponent({
  setup () {
    return () => <Login authSelect={(provider) => signIn({provider})} />
  }
})