import { createApp } from 'vue'

import { router } from './router.js'
import { store } from './store/index.js'
import ElementPlus from 'element-plus'
import 'element-plus/theme-chalk/index.css'

import './assets/styles/main.scss'
import App from './App.vue'

const app = createApp(App)
app.use(router)
app.use(store)
app.use(ElementPlus)
// app.directive('click-outside', {
//      bind: function (el, binding, vnode) {
//           el.clickOutsideEvent = function (event) {
//                // here I check that click was outside the el and his children
//                if (!(el == event.target || el.contains(event.target))) {
//                     // and if it did, call method provided in attribute value
//                     vnode.context[binding.expression](event)
//                }
//           }
//           document.body.addEventListener('click', el.clickOutsideEvent)
//      },
//      unbind: function (el) {
//           document.body.removeEventListener('click', el.clickOutsideEvent)
//      },
// })

app.mount('#app')
