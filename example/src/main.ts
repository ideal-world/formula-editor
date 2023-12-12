import FormulaEditor from '@idealworld/formula-editor'
import '@idealworld/formula-editor/dist/style.css'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import { createApp } from 'vue'
import App from './App.vue'

createApp(App)
  .use(ElementPlus)
  .use(FormulaEditor)
  .mount('#app')
