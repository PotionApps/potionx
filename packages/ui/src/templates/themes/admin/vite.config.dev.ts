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
  plugins: [
    jsx(),
    ...WindiCSS({
      scan: {
        dirs: ['../../components', './src'],
        runOnStartup: true
      },
      safelist: 'prose prose-sm m-auto'
    })
  ]
})
