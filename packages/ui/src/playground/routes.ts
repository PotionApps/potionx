import { routeNames } from './routeNames'
import { RouteRecordRaw } from 'vue-router'
import RouteAdmin from './RouteAdmin/RouteAdmin'
import RouteLogin from './RouteLogin/RouteLogin'
import RouteLoginError from './RouteLoginError/RouteLoginError'

const routes : RouteRecordRaw[] = [
  {
    name: routeNames.admin,
    path: '/admin',
    component: RouteAdmin
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
]

export default routes