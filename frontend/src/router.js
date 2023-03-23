import { createRouter, createWebHashHistory } from 'vue-router'

import Home from './views/Home.vue'
import Chat from './views/Chat.vue'
import BoardIndex from './views/BoardIndex.vue'
import BoardDetails from './cmps/BoardDetails.vue'
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
    path: '/board',
    name: 'BoardIndex',
    component: BoardIndex,
    children: [
      {
        path: '/board',
        name: 'Board',
        component: BoardDetails,
      },
      {
        path: '/board/kanban',
        name: 'BoardKanban',
        component: Kanban,
      },
      {
        path: '/board/dashboard',
        name: 'BoardDashboard',
        component: Dashboard,
      },
    ],
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
]

export const router = createRouter({
  routes,
  history: createWebHashHistory(),
  // base: process.env.BASE_URL,
})
