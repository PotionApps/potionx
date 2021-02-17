import * as Stories from '../stories'
import { routeNames } from './routeNames'
import { RouteRecordRaw } from 'vue-router'
import RouteHome from './RouteAdmin/RouteAdmin'
import RouteLogin from './RouteLogin/RouteLogin'
import RouteMenu from './RouteMenu/RouteMenu'
import RouteLoginError from './RouteLoginError/RouteLoginError'
import RouteComponent from './RouteComponent/RouteComponent'
import RouteError from './RouteError/RouteError'

const routes : RouteRecordRaw[] = [
  {
    name: routeNames.home,
    path: '',
    component: RouteHome
  },
  {
    name: routeNames.login,
    path: '/login',
    component: RouteLogin
  },
  {
    name: routeNames.loginError,
    path: '/login/error',
    component: RouteLoginError
  },
  {
    name: routeNames.menu,
    path: '/menu',
    component: RouteMenu
  },
  {
    path: "/components",
    component: RouteComponent,
    children:
      Object.keys(Stories).map(key => {
        return {
          component: (Stories as any)[key],
          name: key + "Component",
          path: key
        }
      })
  },
  {
    name: routeNames.error,
    path: '/:pathMatch(.*)*',
    component: RouteError
  },
]
export default routes