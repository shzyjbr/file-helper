import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import Directive from '@/directives'
import 'element-plus/dist/index.css'
import '@/assets/styles/reset.scss'
import '@/assets/styles/comm.scss'

const app = createApp(App)
app.use(Directive)
app.use(ElementPlus)
app.use(router).mount('#app')
