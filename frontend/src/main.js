import { createApp } from 'vue'

import ElementPlus from 'element-plus'
// import { QuillEditor } from '@vueup/vue-quill'

import '@vueup/vue-quill/dist/vue-quill.snow.css'
import 'element-plus/theme-chalk/index.css'
// import FloatingVue from 'floating-vue'

import { router } from './router.js'
import { store } from './store/index.js'

import './assets/styles/main.scss'
import App from './App.vue'

import { clickOutsideDirective } from './directives'

const app = createApp(App)
app.directive('click-outside', clickOutsideDirective)

app.use(router)
app.use(store)
app.use(ElementPlus)
// app.use(FloatingVue)

app.mount('#app')
