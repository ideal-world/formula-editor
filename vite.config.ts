import {defineConfig} from 'vite'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import {ElementPlusResolver} from 'unplugin-vue-components/resolvers'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
import vue from '@vitejs/plugin-vue'
import * as path from "path";

module.exports = defineConfig({
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
            formats: ['es'],
            fileName: (format) => `formula-editor.${format}.js`
        },
        rollupOptions: {
            external: ['vue', 'codemirror', 'element-plus', 'eslint-linter-browserify', 'vue-codemirror6', /@codemirror\/.+/, /@lezer\/.+/, /@element-plus\/.+/],
            output: {
                exports: 'named',
                globals: {
                    vue: 'Vue'
                }
            }
        },
        emptyOutDir: false
    }
})
