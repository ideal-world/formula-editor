import * as path from 'node:path'
import { defineConfig } from 'vite'
import Components from 'unplugin-vue-components/vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [
    vue(),
    Components({
      dirs: ['src/components'],
      extensions: ['vue'],
      dts: 'components.d.ts',
    }),
  ],
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'formula-editor',
      formats: ['es', 'umd'],
      fileName: format => `formula-editor.${format}.js`,
    },
    rollupOptions: {
      external: ['vue', 'vue-i18n', 'codemirror', 'octicons-css', 'eslint-linter-browserify', 'vue-codemirror6', /@codemirror\/.+/, /@lezer\/.+/],
      output: {
        exports: 'named',
        globals: {
          vue: 'Vue',
        },
      },
    },
    emptyOutDir: false,
  },
  test: {
    globals: true,
    environment: 'happy-dom',
  },
})
