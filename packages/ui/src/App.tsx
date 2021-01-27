import { defineComponent } from 'vue'
import googleLogo from './assets/google-logo.svg'
import microsoftLogo from './assets/microsoft-logo.svg'

export default defineComponent({
  name: 'App',
  components: {
  },
  props: {
    logo: String,
    organization: String
  },
  setup () {
    return () => <div></div>
  }
})