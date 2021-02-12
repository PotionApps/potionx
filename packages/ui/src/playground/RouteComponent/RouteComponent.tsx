import { defineComponent } from "vue";

export default defineComponent({
  setup () {
    return () => (
      <div class="bg-white">
        <router-view />
      </div>
    )
  }
})