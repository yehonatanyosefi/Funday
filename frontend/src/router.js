import { createRouter, createWebHashHistory } from 'vue-router'

import Home from './views/Home.vue'
import BoardIndex from './views/BoardIndex.vue'
import BoardDetails from './cmps/BoardDetails.vue'
import LoginSignup from './views/LoginSignup.vue'
import UserDetails from './views/UserDetails.vue'
import Kanban from './cmps/Kanban.vue'
import Dashboard from './cmps/Dashboard.vue'
import TaskDetails from './views/TaskDetails.vue'
import { store } from './store'

const routes = [
	{
		path: '/',
		name: 'Home',
		component: Home,
	},
	{
		path: '/board/:boardId',
		name: 'BoardIndex',
		component: BoardIndex,
		children: [
			{
				path: 'main-table',
				name: 'Board',
				component: BoardDetails,
				children: [
					{
						path: 'task/:taskId',
						name: 'TaskDetails',
						component: TaskDetails,
					},
				],
			},
			{
				path: 'kanban',
				name: 'BoardKanban',
				component: Kanban,
				children: [
					{
						path: 'task-kanban/:taskId',
						name: 'TaskDetailsKanban',
						component: TaskDetails,
					},
				],
			},
			{
				path: 'dashboard',
				name: 'BoardDashboard',
				component: Dashboard,
			},
		],
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
		path: '/login',
		name: 'LoginSignup',
		component: LoginSignup,
	},
]

export const router = createRouter({
	routes,
	history: createWebHashHistory(),
})

router.beforeEach((to, from) => {
	const user = store.getters.loggedinUser
	// if (!user._id && to.name !== 'LoginSignup') {
	// 	return { name: 'LoginSignup' }
	// } else
	if (to.name === 'LoginSignup' && user._id && user.username !== 'guest@gmail.com') return { name: 'Home' }
})