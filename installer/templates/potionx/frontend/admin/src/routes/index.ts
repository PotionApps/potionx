import { routeNames } from './routeNames'
import { RouteRecordRaw } from 'vue-router'
import RouteHome from './RouteHome/RouteHome'
import RouteLogin from './RouteLogin/RouteLogin'


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
  }
]
export default routes