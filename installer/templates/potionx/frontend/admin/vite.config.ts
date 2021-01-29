import { defineConfig } from 'vite'
import jsx from '@vitejs/plugin-vue-jsx'
import path from 'path'

export default defineConfig({
  alias: {
    'shared': path.resolve(__dirname, '../shared/src')
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
  plugins: [jsx()]
})
