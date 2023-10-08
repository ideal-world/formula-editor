import DefaultTheme from 'vitepress/theme'
import DemoContainer from '../components/DemoContainer.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import FormulaEditor from '../../../src'

globalThis.__VUE_PROD_DEVTOOLS__ = false

export default {
  ...DefaultTheme,
  enhanceApp({ app }) {
    app.use(ElementPlus)
    app.use(FormulaEditor)
    app.component('DemoContainer', DemoContainer)
  },
}
