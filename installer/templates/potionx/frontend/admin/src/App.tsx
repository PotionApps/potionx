import { defineComponent } from 'vue'
import HelloWorld from './components/HelloWorld'

export default defineComponent({
  name: 'App',
  components: {
    HelloWorld
  },
  setup () {
    return () => <HelloWorld />
  }
})