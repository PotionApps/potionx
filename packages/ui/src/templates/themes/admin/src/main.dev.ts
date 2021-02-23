import 'vite/dynamic-import-polyfill'
import { createApp, pushScopeId } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { make, makeSubject } from 'wonka';
import App from './App'
import RouteEdit from 'root/crudRoutes/RouteEdit'
import RouteList from 'root/crudRoutes/RouteList'
import routes from './routes'
import useAdminNavPrimary from './useAdminNavPrimary'
import "@fontsource/inter/400.css"
import "@fontsource/inter/700.css"
import "@fontsource/inter/variable.css"
import './main.css'
import 'windi.css'

const router = createRouter({
  history: createWebHistory(),
  routes, // short for `routes: routes`
})

// add routes
router.addRoute({
  component: RouteEdit,
  name: "__model_graphql_case__Edit",
  path: "/edit/:id"
})
router.addRoute({
  component: RouteList,
  name: "list",
  path: "/list"
})


const mockQuery = () => {
  let data
  switch (router.currentRoute.value.name) {
    case "__model_graphql_case__Edit":
      data = {
        __model_graphql_case__Single: {
          "deletedAt": "2010-04-17T14:00:00Z",
          "email": "test@example.com",
          "id": "1",
          "insertedAt": "2010-04-17T14:00:00",
          "nameFirst": "Elon",
          "nameLast": "Melon",
          "roles": ["admin"],
          "updatedAt": "2010-04-17T14:00:00"
        }
      }
      break;
    case "list":
      data = {
        __model_graphql_case__Collection: {
          edges: [
            {
              node: {
                "deletedAt": "2010-04-17T14:00:00Z",
                "email": "test@example.com",
                "id": "1",
                "insertedAt": "2010-04-17T14:00:00",
                "nameFirst": "Elon",
                "nameLast": "Melon",
                "roles": ["admin"],
                "updatedAt": "2010-04-17T14:00:00"
              }
            },
            {
              node: {
                "deletedAt": "2010-04-17T14:00:00Z",
                "email": "wine@example.com",
                "id": "2",
                "insertedAt": "2010-04-17T14:00:00",
                "nameFirst": "John",
                "nameLast": "Smith",
                "roles": ["guest"],
                "updatedAt": "2010-04-17T14:00:00"
              }
            }
          ]
        }
      }
      break;
  }
  return Promise.resolve([{
    data
  }])
}

const source = make(observer => {
  const { next, complete } = observer;
  let cancelled = false;
  mockQuery().then(arr => {
    if (!cancelled) {
      arr.forEach(next);
      complete();
    }
  });
  return () => {
    cancelled = true;
  };
});


const app = createApp(App)
app.use(router)
app.provide(
  '$urql', 
  {
    executeQuery: () => {
      return source
    }
  }
)
app.mount('#app')


// add nav
useAdminNavPrimary().value.push({
  label: "List",
  to: {
    name: "list"
  }
})