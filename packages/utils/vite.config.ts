import { defineConfig } from 'vite'
import jsx from '@vitejs/plugin-vue-jsx'
const path = require('path')

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, 'lib/index.ts'),
      name: '@potionapps/ui'
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: ['vue', 'vue-router', '@fortawesome/vue-fontawesome'],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          vue: 'Vue'
        }
      }
    }
  },
  plugins: [jsx()]
})
