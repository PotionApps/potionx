import { resolveComponent, h } from 'vue'
import { routeNames } from './routeNames'
import { RouteRecordRaw } from 'vue-router'
import RouteError from './RouteError/RouteError'
import RouteHome from './RouteHome/RouteHome'
import RouteLogin from './RouteLogin/RouteLogin'
import RouteLoginError from './RouteLoginError/RouteLoginError'
import RouteUserEdit from './RouteUserEdit/RouteUserEdit'
import RouteUserList from './RouteUserList/RouteUserList'


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
    component: {
      render: () => h(resolveComponent('RouterView'))
    },
    path: '/user-list',
    children: [
      {
        name: routeNames.userList,
        path: '',
        component: RouteUserList
      },
      {
        name: routeNames.userEdit,
        path: ':id',
        component: RouteUserEdit
      }
    ]
  }
)