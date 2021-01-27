import { defineComponent, PropType } from 'vue'
import googleLogo from '../../assets/google-logo.svg'
import LoginButton from '../LoginButton/LoginButton'
import microsoftLogo from '../../assets/microsoft-logo.svg'

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
        image: googleLogo,
        provider: 'google'
      },
      {
        click: () => {
          props.authSelect('azure_ad')
        },
        label: "Microsoft",
        image: microsoftLogo,
      }
    ]

    return () => <div class="bg-white flex flex-col items-center justify-center py-12 px-6 min-h-screen">
      <div class="p-6 s450:px-10 w-full bg-gray-100 max-w-400 text-center shadow-md rounded">
        <h1 class="text-gray-800 text-2xl mb-8">Sign In</h1>
        <div>
          {
            loginOptions.map(i => <LoginButton class="mb-2" {...i} key={i.label} />)
          }
        </div>
      </div>
    </div>
  }
})