import { defineComponent } from 'vue'

export default defineComponent({
  name: 'App',
  components: {
  },
  setup () {
    return () => <div><h1>Hello World</h1></div>
  }
})