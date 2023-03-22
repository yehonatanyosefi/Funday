import {createRouter, createWebHashHistory} from 'vue-router'

import Home from './views/Home.vue'
import Chat from './views/Chat.vue'
import BoardIndex from './views/BoardIndex.vue'
import LoginSignup from './views/LoginSignup.vue'
import UserDetails from './views/UserDetails.vue'
import Kanban from './cmps/Kanban.vue'
import Dashboard from './cmps/Dashboard.vue'

const routes = [
  // {
  //   path: '/',
  //   name: 'Home',
  //   component: Home
  // },
  {
    path: '/',
    name: 'BoardIndex',
    component: BoardIndex,
  },
  {
    path: '/chat',
    name: 'Chat',
    component: Chat,
  },
  {
    path: '/login',
    name: 'LoginSignup',
    component: LoginSignup,
  },
  {
    path: '/user/:id',
    name: 'UserDetails',
    component: UserDetails,
  },
  {
    path: '/board/kanban',
    name: 'board-kanban',
    component: Kanban,
  },
  {
    path: '/board/dashboard',
    name: 'board-dashboard',
    component: Dashboard,
  },
]

export const router = createRouter({
  routes,
  history: createWebHashHistory(),
  // base: process.env.BASE_URL,
})
