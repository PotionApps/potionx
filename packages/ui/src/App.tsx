import { defineComponent } from 'vue'

export default defineComponent({
  name: 'App',
  components: {
  },
  props: {
    logo: String,
    organization: String
  },
  setup () {
    return () => <div>
      <router-view />
    </div>
  }
})