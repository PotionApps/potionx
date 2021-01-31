import 'vite/dynamic-import-polyfill'
import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App'
import routes from './routes'
import "@fontsource/inter/400.css"
import "@fontsource/inter/700.css"
import "@fontsource/inter/variable.css"
import './main.css'

import { authExchange } from '@urql/exchange-auth'
import { cacheExchange } from '@urql/exchange-graphcache';
import { dedupExchange, fetchExchange } from '@urql/core';
import urql from '@urql/vue';

const router = createRouter({
  history: createWebHistory(),
  routes, // short for `routes: routes`
})

const app = createApp(App)
app.use(router)
app.use(
  urql,
  {
    url: '/graphql/v1',
    exchanges: [
      dedupExchange,
      cacheExchange(),
      authExchange({
        addAuthToOperation: ({authState, operation}) => operation,
        getAuth: async ({ authState, mutate }) => {
          if (
            typeof document !== 'undefined' && !document.cookie.includes('frontend') &&
            router.currentRoute.value.name
          ) {
            await fetch(
              '/api/v1/session/renew', 
              {
                credentials: 'same-origin',
                headers: {
                  'Content-Type': 'application/json',
                },
                method: "POST"
              }
            )
          }
          return null;
        }
      }),
      fetchExchange
    ],
  }
)
app.mount('#app')
