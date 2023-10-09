import {createApp} from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import FormulaEditor from '@idealworld/formula-editor';
import '@idealworld/formula-editor/dist/style.css';

createApp(App)
    .use(ElementPlus)
    .use(FormulaEditor)
    .mount('#app')
