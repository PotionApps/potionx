import { defineConfig } from 'vite'
import jsx from '@vitejs/plugin-vue-jsx'

export default defineConfig({
  build: {
    emptyOutDir: true,
    lib: {
      entry: './src/index.ts',
      name: 'Potion UI'
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: ['vue'],
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
  plugins: [jsx()]
})
