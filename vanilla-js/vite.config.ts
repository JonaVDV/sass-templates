import {defineConfig} from 'vite'
import purgecss from '@fullhuman/postcss-purgecss'

/**
 * Vite configuration object.
 * @see https://vitejs.dev/config/
 */
export default defineConfig({
  css: {
    postcss: {
      plugins: [
        purgecss({
          content: ['./**/*.html']
        })
      ]
    }
  }
})