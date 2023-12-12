import DefaultTheme from 'vitepress/theme'
import DemoContainer from '../components/DemoContainer.vue'
import FormulaEditor from '../../../src'

globalThis.__VUE_PROD_DEVTOOLS__ = false

export default {
  ...DefaultTheme,
  enhanceApp({ app }) {
    app.use(FormulaEditor)
    app.component('DemoContainer', DemoContainer)
  },
}
