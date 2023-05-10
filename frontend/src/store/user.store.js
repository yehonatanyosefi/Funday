import { userService } from '../services/user.service'

// var localLoggedinUser = null
// if (sessionStorage.user) localLoggedinUser = JSON.parse(sessionStorage.user || null)

export const userStore = {
	state: {
		loggedinUser: null,
		demoUser: {
			fullname: 'Guest',
			imgUrl: 'https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_1280.png',
			mentions: [],
			password: '123',
			username: 'Guest@gmail.com',
			_id: 'u101',
		},
		users: [],
		watchedUser: null,
	},
	getters: {
		users({ users }) {
			return users
		},
		loggedinUser({ loggedinUser, demoUser }) {
			const user = loggedinUser || demoUser
			return user
			// return loggedinUser || demoUser
		},
		watchedUser({ watchedUser }) {
			return watchedUser
		},
	},
	mutations: {
		setLoggedinUser(state, { user }) {
			state.loggedinUser = user ? { ...user } : null
		},
		setWatchedUser(state, { user }) {
			state.watchedUser = user
		},
		setUsers(state, { users }) {
			state.users = users
		},
		removeUser(state, { userId }) {
			state.users = state.users.filter((user) => user._id !== userId)
		},
		setUserScore(state, { score }) {
			state.loggedinUser.score = score
		},
	},
	actions: {
		async login({ commit, dispatch }, { userCred }) {
			try {
				let user = await userService.login(userCred)
				user = JSON.parse(JSON.stringify(user))
				commit({ type: 'setLoggedinUser', user })
				commit({ type: 'removeBoards' })
				dispatch({ type: 'loadBoardList' })
				return user
			} catch (err) {
				console.log('userStore: Error in login', err)
				throw err
			}
		},
		async signup({ commit }, { userCred }) {
			try {
				const cred = JSON.parse(JSON.stringify(userCred))
				// console.log('cred',cred)
				const user = await userService.signup(cred)
				commit({ type: 'setLoggedinUser', user })

				return user
			} catch (err) {
				console.log('userStore: Error in signup', err)
				throw err
			}
		},
		async logout({ commit, dispatch }) {
			try {
				await userService.logout()
				commit({ type: 'setLoggedinUser', user: null })
				await dispatch({ type: 'guestLogin' })
			} catch (err) {
				console.log('userStore: Error in logout', err)
				throw err
			}
		},
		async guestLogin({ dispatch }) {
			try {
				const userCred = { username: 'guest@gmail.com', password: '1234' }
				let user = await dispatch({ type: 'login', userCred })
				return user
			} catch (err) {
				console.log('userStore: Error in login', err)
				throw err
			}
		},
		async loadUsers({ commit }) {
			try {
				const users = await userService.getUsers()
				commit({ type: 'setUsers', users })
			} catch (err) {
				console.log('userStore: Error in loadUsers', err)
				throw err
			}
		},
		async loadAndWatchUser({ commit }, { userId }) {
			try {
				const user = await userService.getById(userId)
				commit({ type: 'setWatchedUser', user })
			} catch (err) {
				console.log('userStore: Error in loadAndWatchUser', err)
				throw err
			}
		},
		async removeUser({ commit }, { userId }) {
			try {
				await userService.remove(userId)
				commit({ type: 'removeUser', userId })
			} catch (err) {
				console.log('userStore: Error in removeUser', err)
				throw err
			}
		},
		async updateUser({ commit }, { user }) {
			try {
				user = await userService.update(user)
				commit({ type: 'setUser', user })
			} catch (err) {
				console.log('userStore: Error in updateUser', err)
				throw err
			}
		},
		async increaseScore({ commit }) {
			try {
				const score = await userService.changeScore(100)
				commit({ type: 'setUserScore', score })
			} catch (err) {
				console.log('userStore: Error in increaseScore', err)
				throw err
			}
		},
		// Keep this action for compatability with a common user.service ReactJS/VueJS
		setWatchedUser({ commit }, payload) {
			commit(payload)
		},
	},
}
