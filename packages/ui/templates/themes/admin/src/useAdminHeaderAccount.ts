import { AdminHeaderAccountProps } from "@potionapps/ui";
import { computed, Ref } from "vue";
import { RootQueryType } from 'shared/types'
import { routeNames } from './routes/routeNames'
import { useQuery } from "@urql/vue";
import signOut from 'shared/signOut'

export default () : Ref<AdminHeaderAccountProps> => {
  const { data } = useQuery<RootQueryType>({
    pause: !document.cookie.includes('frontend'),
    query:
      `query {
        me {
          __typename
          id
          email
          name
          surname
          title
        }
      }`
  })

  return computed(() => {
    return { 
      btns: [
        {
          label: "Account",
          to: {
            name: routeNames.login
          }
        },
        {
          click: () => signOut(),
          label: "Log Out"
        }
      ],
      initials:
        ((data.value?.me?.name?.[0] || "") + (data.value?.userSingle?.name?.[0] || "")) ||
        data.value?.me?.email?.slice(0, 2)
    }
  })
}