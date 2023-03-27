import { storageService } from './async-storage.service.js'
import { httpService } from './http.service.js'
import { utilService } from './util.service.js'
import { userService } from './user.service.js'

const STORAGE_KEY = 'boardDB'

export const boardService = {
	// query,
	queryList,
	getById,
	save,
	remove,
	updateBoard,
	getEmptyBoard,
	getEmptyGroup,
	getEmptyTask,
	filterByTxt,
	filterByMember,
	applyDrag,
	saveBoard,
}
window.cs = boardService

_createDemoData()

function getById(boardId) {
	return storageService.get(STORAGE_KEY, boardId)
	// return httpService.get(`boardId/${boardId}`)
}

async function save(boardId = null, type = 'task', payload, groupId = null) {
	let board = type !== 'board' ? await getById(boardId) : payload
	const groupIdx = type !== 'board' ? board?.groups.findIndex((group) => group.id === groupId) : -1
	switch (type) {
		case 'task':
			const taskIdx = board.groups[groupIdx].tasks.findIndex((task) => task.id === payload.id)
			if (taskIdx > -1) {
				board.groups[groupIdx].tasks.splice(taskIdx, 1, payload)[0]
			} else {
				board.groups[groupIdx].tasks.push(payload)
			}
			break
		case 'group':
			if (groupIdx > -1) {
				board.groups[groupIdx] = payload
			} else {
				board.groups.push(payload)
			}
			break
	}
	return await saveBoard(board)
	// board.activities.unshift(activity)
}

async function saveBoard(board) {
	let savedBoard
	if (board._id) {
		savedBoard = await storageService.put(STORAGE_KEY, board)
		// savedTask = await httpService.put(`task/${task._id}`, task)
	} else {
		// Later, owner is set by the backend
		// board.owner = userService.getLoggedinUser()
		savedBoard = await storageService.post(STORAGE_KEY, board)
		// savedTask = await httpService.post('task', task)
	}
	return savedBoard
}

async function updateBoard(boardId, payload) {
	const { type, val } = payload
	let board = await getById(boardId)
	switch (type) {
		case 'title':
			board.title = val
			break
		case 'favorite':
			board.isStarred = val
			break
	}
	return saveBoard(board)
}

async function queryList(filterBy = { txt: '' }) {
	// return httpService.get(STORAGE_KEY, filterBy)

	let boards = await storageService.query(STORAGE_KEY)
	if (filterBy.txt) {
		let boardsCopy = JSON.parse(JSON.stringify(boards))
		const regex = new RegExp(filterBy.txt, 'i')
		boards = boardsCopy.filter((board) => regex.test(board.title))
	}
	const boardList = boards.map((board) => {
		return { _id: board._id, title: board.title }
	})
	// var tasks = await storageService.query(STORAGE_KEY)
	// if (filterBy.txt) {
	//     const regex = new RegExp(filterBy.txt, 'i')
	//     tasks = tasks.filter(task => regex.test(task.vendor) || regex.test(task.description))
	// }
	// if (filterBy.price) {
	//     tasks = tasks.filter(task => task.price <= filterBy.price)
	// }
	// return tasks
	return boardList
}

async function remove(ids, type) {
	const { boardId, groupId, taskId } = ids
	let board = await getById(boardId)
	const groupIdx = type !== 'board' ? board.groups.findIndex((group) => group.id === groupId) : -1
	switch (type) {
		case 'task':
			const taskIdx = board.groups[groupIdx].tasks.findIndex((task) => task.id === taskId)
			const tasks = board.groups[groupIdx].tasks.splice(taskIdx, 1)[0]
			const group = board.groups.splice(groupIdx, 1, tasks)[0]
			board.groups[groupIdx] = group
			return await saveBoard(board)
			break
		case 'group':
			board.groups.splice(groupIdx, 1)
			return await saveBoard(board)
			break
		case 'board':
			return await storageService.remove(STORAGE_KEY, boardId)
			// return httpService.delete(`task/${taskId}`)
			break
	}
}

function filterByTxt(board, txt) {
	txt = txt.trim()
	if (!txt) return board
	const regex = new RegExp(txt, 'i')

	board.groups = board.groups.reduce((groupArr, group) => {
		const isGroupTitleMatch = regex.test(group.title)
		// if (isGroupTitleMatch) {
		//   const isWord = !!group.title
		//     .split(' ')
		//     .find((word) => word.toLowerCase() === txt.toLowerCase())
		// group.title = group.title.replaceAll(
		//   regex,
		//   (match) =>
		//     `<span class="highlight">${match}${isWord ? '&nbsp' : ''}</span>`
		// )
		// }

		group.tasks = group.tasks.reduce((taskArr, task) => {
			if (regex.test(task.title)) {
				// task.title = task.title.replaceAll(
				//   regex,
				//   (match) => `<span class="highlight">${match}</span>`
				// )
				taskArr.push(task)
			}
			return taskArr
		}, [])

		if (group.tasks?.length || regex.test(group.title)) groupArr.push(group)
		return groupArr
	}, [])
	return board
}

function filterByMember(board, member) {
	const memberId = member._id
	board.groups = board.groups.reduce((groupArr, group) => {
		group.tasks = group.tasks.reduce((taskArr, task) => {
			if (task.person.includes(memberId)) {
				taskArr.push(task)
			}
			return taskArr
		}, [])

		if (group.tasks?.length) groupArr.push(group)
		return groupArr
	}, [])
	return board
}

async function applyDrag(addedId, removedId, type, boardId, groupId) {
	//arr, dragResult
	let board
	switch (type) {
		case 'task':
			board = await getById(boardId)
			const groupIdx = board.groups.findIndex((group) => group.id === groupId)
			const addedIdx = board.groups[groupIdx].tasks.findIndex((task) => task.id === addedId)
			const removedIdx = board.groups[groupIdx].tasks.findIndex((task) => task.id === removedId)
			if (addedIdx !== -1 && removedIdx !== -1) {
				const temp = board.groups[groupIdx].tasks[addedIdx]
				board.groups[groupIdx].tasks[addedIdx] = board.groups[groupIdx].tasks[removedIdx]
				board.groups[groupIdx].tasks[removedIdx] = temp
			}
			return await saveBoard(board)
			break
		case 'group':
			board = await getById(boardId)
			const addedGroupIdx = board.groups.findIndex((group) => group.id === addedId)
			const removedGroupIdx = board.groups.findIndex((group) => group.id === removedId)
			if (addedGroupIdx !== -1 && removedGroupIdx !== -1) {
				const temp = board.groups[addedGroupIdx]
				board.groups[addedGroupIdx] = board.groups[removedGroupIdx]
				board.groups[removedGroupIdx] = temp
			}
			return await saveBoard(board)
			break
		case 'board':
			const boards = await storageService.query(STORAGE_KEY)
			const addedBoardIdx = boards.findIndex((board) => board._id === addedId)
			const removedBoardIdx = boards.findIndex((board) => board._id === removedId)
			if (addedBoardIdx !== -1 && removedBoardIdx !== -1) {
				boards[addedBoardIdx]._id = removedId
				boards[removedBoardIdx]._id = addedId
				await saveBoard(boards[removedBoardIdx])
				await saveBoard(boards[addedBoardIdx])
			}
			return queryList()
			break
	}
}
// async function query(filterBy = { txt: '', price: 0 }) {
//     // return httpService.get(STORAGE_KEY, filterBy)

//     const boards = await storageService.query(STORAGE_KEY)
//     // var tasks = await storageService.query(STORAGE_KEY)
//     // if (filterBy.txt) {
//     //     const regex = new RegExp(filterBy.txt, 'i')
//     //     tasks = tasks.filter(task => regex.test(task.vendor) || regex.test(task.description))
//     // }
//     // if (filterBy.price) {
//     //     tasks = tasks.filter(task => task.price <= filterBy.price)
//     // }
//     // return tasks
//     return boards
// }

function getEmptyTask() {
	return {
		id: utilService.makeId(),
		title: 'New Task',
		status: '',
		priority: '',
		text: '',
		comments: [],
		person: [],
		timeline: {
			startDate: Date.now(),
			dueDate: null,
		},
		date: Date.now(),
		byMember: {
			_id: '',
			username: '',
			fullname: '',
			imgUrl: '',
		},
		style: {
			bgColor: '',
		},
	}
}

function getEmptyGroup() {
	return {
		id: utilService.makeId(),
		title: 'Title',
		archivedAt: null,
		tasks: [getEmptyTask(), getEmptyTask(), getEmptyTask()],
		style: {
			color: getRndColor(),
		},
	}
}

function getRndColor() {
	const colors = [
		'#037F4C',
		'#00C875',
		'#9CD326',
		'#CAB641',
		'#FFCB00',
		'#784BD1',
		'#A25DDC',
		'#0086C0',
		'#579BFC',
		'#66CCFF',
		'#BB3354',
		'#E2445C',
		'#FF5AC4',
		'#FF642E',
		'#FDAB3D',
		'#7F5347',
		'#C4C4C4',
		'#808080',
	]
	const randomIdx = utilService.getRandomIntInclusive(0, colors.length - 1)
	return colors[randomIdx]
}

function getEmptyBoard() {
	return {
		title: 'New Board',
		isStarred: false,
		archivedAt: '',
		cmpOrder: ['date', 'person', 'status', 'text', 'priority', 'timeline'],
		createdBy: {
			_id: '',
			fullname: '',
			imgUrl: '',
		},
		style: {},
		labels: [],
		members: [],
		groups: [getEmptyGroup(), getEmptyGroup()],
	}
}

import jsonBoard from '../../data/board.json' assert { type: 'json' }
function _createDemoData() {
	const board = utilService.loadFromStorage(STORAGE_KEY)
	if (!board) {
		utilService.saveToStorage(STORAGE_KEY, jsonBoard)
	}
}
