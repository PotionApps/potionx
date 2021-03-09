import AdminFooter from 'components/AdminFooter/AdminFooter'
import AdminMain from 'components/AdminMain/AdminMain'
import { defineComponent } from 'vue'
import { faDiscord, faGithub, faTwitter, faYoutube } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@potionapps/utils'
import Logo from '../../assets/logo.svg'

export default defineComponent({
  setup () {
    const links = [
      {icon: faDiscord, url: "https://discord.gg/JydTNZCS"},
      {icon: faGithub, url: "https://github.com/PotionApps/potionx"},
      {icon: faTwitter, url: "https://twitter.com/Potionapps"},
      {icon: faYoutube, url: "https://www.youtube.com/channel/UCQwh1NM_EpDmY7tEnNb3xdA/featured"}
    ]
    return () => <AdminMain>
      <div class="pt-24 px-6 text-center">
        <img class="m-auto mb-2 w-10" src={Logo} />
        <h1 class="font-semibold mb-2 text-3xl text-gray-700">Welcome to Potionx</h1>
        <p class="text-gray-800 mb-2">
          Check out the <a
            class="border-b border-blue-200 hover:border-blue-500 text-blue-400 hover:text-blue-500 transition"
            href="https://docs.potionapps.com"
            target="_blank">documentation</a> to get started.
        </p>
        <hr class="border-gray-300 mb-4 mt-12 m-auto max-w-250" />
        <p class="">Where you can find us</p>
        <nav class="flex items-center justify-center mt-2">
          {links.map(link => {
            return <a 
              class="mx-2 text-gray-500 hover:text-blue-500 text-2xl transition"
              href={link.url}
              target="_blank">
                <FontAwesomeIcon icon={link.icon} />
            </a>
          })}
        </nav>
        
      </div>
      <AdminFooter />
    </AdminMain>
  }
})