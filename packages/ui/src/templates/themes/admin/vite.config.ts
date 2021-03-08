import { defineConfig } from 'vite'
import jsx from '@vitejs/plugin-vue-jsx'
// @ts-ignore
import { resolve } from "path";
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
  build: {
    emptyOutDir: true,
    manifest: true,
    outDir: "../../priv/static",
    rollupOptions: {
      // overwrite default .html entry
      input: './src/main.ts'
    }
  },
  plugins: [
    jsx(),
    WindiCSS({
      preflight: {
        safelist: ['[type="text"]', '[type="number"]', '[type="email"]']
      },
      scan: {
        dirs: ['../../components', './src'],
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
