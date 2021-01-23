import { defineConfig } from 'vite'
import jsx from '@vitejs/plugin-vue-jsx'

export default defineConfig({
  build: {
    emptyOutDir: true,
    manifest: true,
    outDir: "../../priv/static",
    rollupOptions: {
      // overwrite default .html entry
      input: './src/main.ts'
    }
  },
  plugins: [jsx()]
})
