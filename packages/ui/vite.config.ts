import { defineConfig } from 'vite'
import jsx from '@vitejs/plugin-vue-jsx'
import WindiCSS from 'vite-plugin-windicss'
import { resolve } from "path";

export default defineConfig({
  resolve: {
    alias: {
      'root': resolve(__dirname, './src/templates')
    }
  },
  build: {
    emptyOutDir: true,
    lib: {
      entry: './index.ts',
      name: 'Potion UI'
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: ['vue', 'vue-router', '@fortawesome/vue-fontawesome'],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        entryFileNames: "@potion-ui.[format].js",
        globals: {
          vue: 'Vue'
        }
      }
    }
  },
  plugins: [
    jsx(),
    ...WindiCSS({
      safelist: 'prose prose-sm m-auto'
    })
  ]
})
