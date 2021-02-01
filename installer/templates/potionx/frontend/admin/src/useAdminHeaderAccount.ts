import { AdminHeaderAccountProps } from "@potionapps/ui";
import { User } from 'shared/types'
import { routeNames } from './routes/routeNames'
import signOut from 'shared/signOut'


export default (user?: User) : AdminHeaderAccountProps => {
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
    initials: (user?.name?.[0] || "") + (user?.surname?.[0] || "")
  }
}