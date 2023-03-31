import { createApp } from 'vue'

import { router } from './router.js'
import { store } from './store/index.js'
// import { quillEditor } from 'vue3-quill'
import ElementPlus from 'element-plus'

import 'element-plus/theme-chalk/index.css'

import './assets/styles/main.scss'
import App from './App.vue'

import { clickOutsideDirective } from './directives'

const app = createApp(App)
app.directive('click-outside', clickOutsideDirective)

app.use(router)
app.use(store)
app.use(ElementPlus)
// app.use(quillEditor)

app.mount('#app')
