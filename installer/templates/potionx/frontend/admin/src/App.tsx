import { defineComponent } from 'vue'

export default defineComponent({
  name: 'App',
  components: {},
  setup () {
    return () => {
      return <div>
        <router-view></router-view>
      </div>
    }
  }
})