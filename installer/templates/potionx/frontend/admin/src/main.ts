import 'vite/dynamic-import-polyfill'
import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App'
import routes from './routes'
import './main.css'

const router = createRouter({
  history: createWebHistory(),
  routes, // short for `routes: routes`
})

const app = createApp(App)
app.use(router)
app.mount('#app')
