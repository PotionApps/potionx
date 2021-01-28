import { routeNames } from './routeNames'
import { RouteRecordRaw } from 'vue-router'
import RouteAdmin from './RouteAdmin/RouteAdmin'
import RouteLogin from './RouteLogin/RouteLogin'

const routes : RouteRecordRaw[] = [{
  name: routeNames.admin,
  path: '/admin',
  component: RouteAdmin
},
{
  name: routeNames.login,
  path: '/login',
  component: RouteLogin
}]

export default routes