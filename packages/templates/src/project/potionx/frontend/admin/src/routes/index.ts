import RouteUserList from './RouteUserList/RouteUserList'
import RouteUserEdit from './RouteUserEdit/RouteUserEdit'
import { routeNames } from './routeNames'
import { RouteRecordRaw } from 'vue-router'
import RouteError from './RouteError/RouteError'
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
  },
  {
    name: routeNames.error,
    path: '/:pathMatch(.*)*',
    component: RouteError
  }
]
export default routes

routes.push(
  {
    name: routeNames.userEdit,
    path: '/user-list/:id',
    component: RouteUserEdit
  }
)

routes.push(
  {
    name: routeNames.userList,
    path: '/user-list',
    component: RouteUserList
  }
)