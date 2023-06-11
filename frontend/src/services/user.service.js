import { storageService } from './async-storage.service'
import { httpService } from './http.service'
import { store } from '../store'
import { socketService, SOCKET_EVENT_USER_UPDATED, SOCKET_EMIT_USER_WATCH } from './socket.service'
import { showSuccessMsg } from './event-bus.service'
import { utilService } from './util.service.js'

const STORAGE_KEY_LOGGEDIN_USER = 'loggedinUser'
const STORAGE_KEY = 'userDB'

export const userService = {
	login,
	logout,
	signup,
	getLoggedinUser,
	saveLocalUser,
	getUsers,
	getById,
	remove,
	update,
}

import jsonUsers from '../../data/user.json' assert { type: 'json' }
function getUsers() {
	//   const users = utilService.loadFromStorage(STORAGE_KEY)
	const users = httpService.get(`user`)
	if (!users) {
		// utilService.saveToStorage(STORAGE_KEY, jsonUsers)
		return httpService.get(`user`)
	}
	return users
	// return storageService.query('user')
	// return httpService.get(`user`)
}

function onUserUpdate(user) {
	showSuccessMsg(`This user ${user.fullname} just got updated from socket, new score: ${user.score}`)
	store.dispatch({ type: 'setWatchedUser', user })
}

async function getById(userId) {
	// const user = await storageService.get('user', userId)
	const user = await httpService.get(`user/${userId}`)

	socketService.emit(SOCKET_EMIT_USER_WATCH, userId)
	socketService.off(SOCKET_EVENT_USER_UPDATED, onUserUpdate)
	socketService.on(SOCKET_EVENT_USER_UPDATED, onUserUpdate)

	return user
}
function remove(userId) {
	// return storageService.remove('user', userId)
	return httpService.delete(`user/${userId}`)
}

async function update({ _id, user }) {
	// const user = await storageService.get('user', _id)

	// await storageService.put('user', user)

	updatedUser = await httpService.put(`user/${_id}`, user)
	// Handle case in which admin updates other user's details
	if (getLoggedinUser()._id === user._id) saveLocalUser(user)
	return user
}

async function login(userCred) {
	// const users = await storageService.query(STORAGE_KEY)
	// const user = users.find(user => user.username === userCred.username)
	// // const user = await httpService.post('auth/login', userCred)
	// if (user) return saveLocalUser(user)
	try{
		const user = await httpService.post('auth/login', userCred)
		if (user) return saveLocalUser(user)
		return null	
	}catch(err){
		console.log('error in login',err)
		throw err
	}

	// socketService.login(user._id)
}
async function signup(userCred) {
	if (!userCred.imgUrl)
		userCred.imgUrl = 'https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_1280.png'
	userCred.mentions = []
	console.log('userCred', userCred)
	//   const user = await storageService.post(STORAGE_KEY, userCred)

	const user = await httpService.post('auth/signup', userCred)
	// socketService.login(user._id)
	return saveLocalUser(user)
}
async function logout() {
	sessionStorage.removeItem(STORAGE_KEY_LOGGEDIN_USER)
	// socketService.logout()
	return await httpService.post('auth/logout')
}

function saveLocalUser(user) {
	user = {
		_id: user._id,
		fullname: user.fullname,
		username: user.username,
		imgUrl: user.imgUrl,
		mentions: user.mentions,
	}
	sessionStorage.setItem(STORAGE_KEY_LOGGEDIN_USER, JSON.stringify(user))
	return user
}

function getLoggedinUser() {
	return JSON.parse(sessionStorage.getItem(STORAGE_KEY_LOGGEDIN_USER))
}
