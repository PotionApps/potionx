import { routeNames } from './routeNames'
import { RouteRecordRaw } from 'vue-router'
import RouteHome from './RouteHome/RouteHome'
import RouteLogin from './RouteLogin/RouteLogin'
import RouteLoginError from './RouteLoginError/RouteLoginError'


const routes : RouteRecordRaw[] = [
  {
    name: routeNames.home,
    path: '/',
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
  }
]
export default routes