import { defineComponent } from 'vue'

export default defineComponent({
  name: 'App',
  components: {
  },
  setup () {
    return () => <h1 class="text-gray-500">Hello World</h1>
  }
})