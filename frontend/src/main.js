import {createApp} from 'vue'

import {router} from './router.js'
import {store} from './store/index.js'
import ElementPlus from 'element-plus'
import 'element-plus/theme-chalk/index.css'

import './assets/styles/main.scss'
import App from './App.vue'

const app = createApp(App)
app.use(router)
app.use(store)
app.use(ElementPlus)

app.mount('#app')
