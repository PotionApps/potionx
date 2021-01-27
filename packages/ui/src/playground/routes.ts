import { routeNames } from './routeNames'
import { RouteRecordRaw } from 'vue-router'
import RouteLogin from './RouteLogin/RouteLogin'

const routes : RouteRecordRaw[] = [{
  name: routeNames.login,
  path: '/login',
  component: RouteLogin
}]

export default routes