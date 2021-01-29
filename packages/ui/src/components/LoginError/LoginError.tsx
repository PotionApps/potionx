import { defineComponent } from 'vue'

export default defineComponent({
  name: 'login-error',
  setup (props) {
    return () => <div class="bg-white flex flex-col items-center justify-center py-12 px-6 min-h-screen">
      <div class="p-6 s450:px-10 w-full bg-gray-100 max-w-400 text-center shadow-md rounded">
        <h1 class="text-2xl mb-2">Sign In Failed</h1>
      </div>
    </div>
  }
})