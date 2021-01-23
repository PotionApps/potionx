import { defineComponent } from 'vue'

export default defineComponent({
  name: 'HelloWorld',
  props: {
    msg: {
      type: String
    }
  },
  setup: () => {
    return () => <h1>Hello World</h1>
  }
})