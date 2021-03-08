import { defineConfig } from 'vite'
// @ts-ignore
import { resolve } from "path";
import jsx from '@vitejs/plugin-vue-jsx'
import WindiCSS from 'vite-plugin-windicss'

export default defineConfig({
  root: './',
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
    WindiCSS({
      preflight: {
        safelist: ['[type="text"]', '[type="number"]', '[type="email"]']
      },
      scan: {
        dirs: ['../../components', './src', "../../crudRoutes"],
        runOnStartup: true
      },
      safelist: 'prose prose-sm m-auto'
    }),
    {
      name: "gql",
      transform (src, id) {
        if (/\.(gql)$/.test(id)) {
          return {
            code: `export default \`${src}\``,
            map: null
          }
        }
      }
    }
  ]
})
