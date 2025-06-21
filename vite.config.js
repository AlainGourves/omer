import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), vueDevTools()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    // Cette partie pour que la build produise les fichiers 'vue-app.js' & 'vue-app.css'
    // plutôt que les noms habituels suivis d'un hash.
    rollupOptions: {
      output: {
        // Pour les fichiers JavaScript principaux (comme ton "index" qui deviendra "vue-app.js")
        entryFileNames: (chunkInfo) => {
          if (chunkInfo.name === 'index') {
            return 'vue-app.js'
          }
          // Pour les autres points d'entrée ou chunks JS, garde le nom d'origine.
          return '[name].js'
        },

        // Pour les assets non-JS (CSS, images, polices, etc.)
        assetFileNames: (assetInfo) => {
          // Utilise assetInfo.names[0] pour obtenir le nom de l'asset
          if (assetInfo.names && assetInfo.names[0] === 'index.css') {
            return 'vue-app.css'
          }
          // Pour tous les autres assets (images, etc.), garde leur nom d'origine et leur extension.
          return '[name].[ext]'
        },
      },
    },
  },
})
