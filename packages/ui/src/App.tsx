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

    const loginOptions = [
      {
        label: "Google",
        image: googleLogo
      },
      {
        label: "Microsoft",
        image: microsoftLogo
      }
    ]

    return () => <div class="bg-white flex flex-col items-center justify-center py-12 px-6 min-h-screen">
      <div class="p-6 s450:px-10 w-full bg-gray-100 max-w-400 text-center shadow-md rounded">
        <img class="h-10 mx-auto mb-1" src={googleLogo} />
        <h1 class="text-gray-800 text-2xl mb-8">Sign in to Google</h1>
        <div>
          {
            loginOptions.map(i =><div class="mb-2">
              <button class="bg-white flex items-center justify-center py-2 px-4 flex-nowrap shadow w-full rounded-md hover:shadow-md">
                <span class="text-lg font-medium text-gray-800 pr-2">{i.label}</span>
                <img class="h-8" src={i.image} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  }
})