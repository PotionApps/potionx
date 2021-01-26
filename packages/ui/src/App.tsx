import { defineComponent } from 'vue'

export default defineComponent({
  name: 'App',
  components: {
  },
  setup () {
    return () => <div class="text-center">
      <img src="./logo.png" />
      <h1>Hello World</h1>
      <a href="https://potionapps.com">See docs to get started</a>
    </div>
  }
})