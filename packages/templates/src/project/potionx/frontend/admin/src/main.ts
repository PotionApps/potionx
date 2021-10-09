
import "@fontsource/inter/400.css"
import "@fontsource/inter/700.css"
import "@fontsource/inter/variable.css"
import "tailwindcss/tailwind.css"
import './main.css'
import { authExchange } from '@urql/exchange-auth'
import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { dedupExchange, errorExchange, CombinedError, Operation } from '@urql/core';
import { multipartFetchExchange } from '@urql/exchange-multipart-fetch';
import { parse, stringify } from 'qs'
import { routeNames } from './routes/routeNames'
import App from './App'
import cacheExchange from './cacheExchange'
import routes from './routes'
import schema from 'shared/introspection.json'
import sessionRenew from 'shared/sessionRenew'
import urql from '@urql/vue';


const router = createRouter({
  history: createWebHistory(),
  // @ts-ignore
  parseQuery: parse,
  routes, 
  stringifyQuery: stringify
})

const app = createApp(App)
app.use(router)
app.use(
  urql,
  {
    url: '/graphql/v1',
    exchanges: [
      dedupExchange,
      cacheExchange(schema),
      errorExchange({
        onError: (error: CombinedError, operation: Operation) => {
          console.error(error.message, operation)
        },
      }),
      authExchange({
        addAuthToOperation: ({authState, operation}) => operation,
        getAuth: async ({ authState, mutate }) => {
          if (
            router.currentRoute.value.name !== routeNames.login &&
            router.currentRoute.value.name !== routeNames.loginError &&
            typeof document !== 'undefined' && !document.cookie.includes('frontend') &&
            router.currentRoute.value.name
          ) {
            const res = await sessionRenew()
            if (res.data?.sessionRenew?.error) {
              window.location.href = "/login"
            }
          }
          return null;
        },
        willAuthError: () => {
          return typeof document !== 'undefined' && !document.cookie.includes('frontend')
        }
      }),
      multipartFetchExchange
    ],
  }
)
app.mount('#app')