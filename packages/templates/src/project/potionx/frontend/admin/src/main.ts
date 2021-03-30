import 'vite/dynamic-import-polyfill'
import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App'
import routes from './routes'
import "@fontsource/inter/400.css"
import "@fontsource/inter/700.css"
import "@fontsource/inter/variable.css"
import './main.css'
import "tailwindcss/tailwind.css"

import { authExchange } from '@urql/exchange-auth'
import { cacheExchange } from '@urql/exchange-graphcache';
import { dedupExchange, fetchExchange } from '@urql/core';
import urql from '@urql/vue';
import sessionRenew from 'shared/sessionRenew'
import { routeNames } from './routes/routeNames'

const router = createRouter({
  history: createWebHistory(),
  routes
})

const app = createApp(App)
const cache = cacheExchange()
app.use(router)
app.use(
  urql,
  {
    url: '/graphql/v1',
    exchanges: [
      dedupExchange,
      cache,
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
      fetchExchange
    ],
  }
)
app.mount('#app')