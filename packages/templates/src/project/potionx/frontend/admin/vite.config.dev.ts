import { defineConfig } from 'vite'
// @ts-ignore
import { resolve } from "path";
import jsx from '@vitejs/plugin-vue-jsx'

export default defineConfig({
  root: './',
  resolve: {
    alias: {
      // @ts-ignore
      'components': resolve(__dirname, "../../../../component"),
      // @ts-ignoreS
      'hooks': resolve(__dirname, "../../../../hook"),
      // @ts-ignore
      'root': resolve(__dirname, './src'),
      // @ts-ignore
      'shared': resolve(__dirname, '../../shared/src')
    }
  },
  plugins: [
    jsx(),
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
