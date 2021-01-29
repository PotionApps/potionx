import { routeNames } from './routeNames'
import { RouteRecordRaw } from 'vue-router'
import RouteLogin from './RouteLogin/RouteLogin'
import RouteUsers from './RouteUsers/RouteUsers'

const routes : RouteRecordRaw[] = [
  {
    name: routeNames.login,
    path: '/login',
    component: RouteLogin
  },
  {
    name: routeNames.users,
    path: '/users',
    component: RouteUsers
  }
]

export default routes