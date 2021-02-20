import { defineComponent } from "vue";
import { faGoogle, faMicrosoft } from "@fortawesome/free-brands-svg-icons"
import BtnLogin from 'root/components/Btn/BtnLogin'
import signIn from 'shared/signIn'

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

    const loginOptions = [
      {
        click: () => {
          signIn({provider: 'google'})
        },
        label: "Google",
        icon: faGoogle,
        provider: 'google'
      },
      {
        click: () => {
          signIn({provider: 'azure_ad'})
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
          <form class="flex flex-col mt-12" onSubmit={devLogIn}>
            <div class="mb-2">DEVELOPMENT LOGIN</div>
            <input name="email" placeholder="admin@example.com" type="email" required />
            <BtnLogin class="mt-2" label="Login"></BtnLogin>
          </form>
         }
      </div>
    </div>
  }
})