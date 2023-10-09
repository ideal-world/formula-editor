import { defineConfig } from 'vite'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
import vue from '@vitejs/plugin-vue'
import * as path from "path";

export default defineConfig({
    plugins: [
        vue(),
        AutoImport({
            resolvers: [
                ElementPlusResolver(),
                IconsResolver({
                    prefix: 'Icon'
                })
            ]
        }),
        Components({
            resolvers: [ElementPlusResolver()]
        }),
        Icons({
            autoInstall: true
        })
    ],
    build: {
        lib: {
            entry: path.resolve(__dirname, 'src/index.ts'),
            name: 'formula-editor',
            formats: ['es','umd'],
            fileName: (format) => `formula-editor.${format}.js`
        },
        rollupOptions: {
            external: ['vue', 'vue-i18n', 'codemirror', 'element-plus', 'eslint-linter-browserify', 'vue-codemirror6', /@codemirror\/.+/, /@lezer\/.+/, /@element-plus\/.+/],
            output: {
                exports: 'named',
                globals: {
                    vue: 'Vue'
                }
            }
        },
        emptyOutDir: false
    },
    test: {
        globals: true,
        environment: "happy-dom"
    },
})
