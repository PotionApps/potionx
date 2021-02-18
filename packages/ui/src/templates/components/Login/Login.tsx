import { defineComponent, PropType } from 'vue'
import { faGoogle, faMicrosoft } from "@fortawesome/free-brands-svg-icons"
import LoginButton from '../LoginButton/LoginButton'

export default defineComponent({
  name: 'Login',
  props: {
    authSelect: {
      required: true,
      type: Function as PropType<(provider: string) => void>
    }
  },
  setup (props) {
    const loginOptions = [
      {
        click: () => {
          props.authSelect('google')
        },
        label: "Google",
        icon: faGoogle,
        provider: 'google'
      },
      {
        click: () => {
          props.authSelect('azure_ad')
        },
        label: "Microsoft",
        icon: faMicrosoft,
      }
    ]

    return () => <div class="bg-gray-100 flex flex-col items-center justify-center py-12 px-6 min-h-screen">
      <div class="bg-white max-w-400 p-6 s450:px-10 rounded-lg shadow-md text-center w-full">
        <h1 class="font-semibold mb-6 text-2xl text-gray-600">Sign In</h1>
        <div>
          {
            loginOptions.map(i => <LoginButton class="mb-3" {...i} key={i.label} />)
          }
        </div>
      </div>
    </div>
  }
})