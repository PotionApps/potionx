import { defineComponent } from "vue";
import { faGoogle, faMicrosoft } from "@fortawesome/free-brands-svg-icons"
import { RootMutationType } from "shared/types";
import { useMutation } from "@urql/vue";
import BtnLogin from 'components/Btn/BtnLogin'
import signInMutation from 'shared/signInMutation.gql'

export default defineComponent({
  setup () {
    let devLogIn : ((e: Event) => void)
    if (import.meta.env.DEV) {
      devLogIn = async (e: Event) => {
        e.preventDefault()
        const email = new FormData(e.target as HTMLFormElement).get('email')
        const {
          data: {
            session_params: state,
            url
          }
        } = await fetch(
            `/api/v1/auth/dev/new`
          )
          .then(res => res.json())

        await fetch(
          url,
          {
            body: JSON.stringify({ code: "valid", email, state }),
            credentials: "same-origin", 
            headers: {
              'Content-Type': 'application/json'
            },
            method: "POST"
          }
        )
        .then(res => {
          window.location.reload()
        })
      }
    }

    const { executeMutation } = useMutation<RootMutationType>(signInMutation)
    const signIn = (provider: string) => {
      executeMutation({ provider })
        .then(res => {
          if (res.data?.signInProvider?.url) {
            window.location.href = res.data?.signInProvider?.url
          }
        })
    }

    const loginOptions = [
      {
        click: () => {
          signIn('google')
        },
        label: "Google",
        icon: faGoogle,
        provider: 'google'
      },
      {
        click: () => {
          signIn('azure_ad')
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
            loginOptions.map(i => <BtnLogin class="mb-3" {...i} key={i.label} />)
          }
        </div>
        {
          import.meta.env.DEV &&
          <form class="flex flex-col mt-6" onSubmit={devLogIn}>
            <hr class="border-gray-300 mb-6" />
            <div class="font-semibold mb-2 text-gray-700">DEVELOPMENT LOGIN</div>
            <input class="bg-gray-100 border border-gray-300 mb-1 px-3 py-2 rounded-md outline-none" name="email" placeholder="admin@example.com" type="email" required />
            <BtnLogin class="mt-2" label="Login"></BtnLogin>
          </form>
         }
      </div>
    </div>
  }
})