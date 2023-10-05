import {createApp} from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import FormulaEditor from 'formula-editor';
import 'formula-editor/dist/style.css';

createApp(App)
    .use(ElementPlus)
    .use(FormulaEditor)
    .mount('#app')
