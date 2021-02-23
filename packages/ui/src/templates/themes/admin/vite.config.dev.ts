import { defineConfig } from 'vite'
// @ts-ignore
import { resolve } from "path";
import jsx from '@vitejs/plugin-vue-jsx'
import WindiCSS from 'vite-plugin-windicss'

export default defineConfig({
  resolve: {
    alias: {
      // @ts-ignore
      'root': resolve(__dirname, '../..'),
      // @ts-ignore
      'shared': resolve(__dirname, '../../shared/src')
    }
  },
  plugins: [
    jsx(),
    ...WindiCSS({
      scan: {
        dirs: ['../../components', './src', "../../crudRoutes"],
        runOnStartup: true
      },
      safelist: 'prose prose-sm m-auto'
    })
  ]
})
