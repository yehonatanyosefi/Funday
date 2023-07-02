import { httpService } from './http.service.js'
import { utilService } from './util.service.js'
import { socketService, SOCKET_EVENT_CHANGE_BOARD } from '../services/socket.service'

const API_KEY = 'board/'
const STORAGE_KEY = 'boardDB'

export const boardService = {
	queryList,
	getById,
	// save,
	removeBoard,
	updateBoard,
	getEmptyBoard,
	getEmptyGroup,
	getEmptyTask,
	setAdvanceFilter,
	filterByTxt,
	filterByMember,
	applyDrag,
	saveBoard,
	getDemoDev,
	getDemoFinance,
	addGptBoard,
}

async function getById(boardId) {
	const board = await httpService.get(`${API_KEY}/${boardId}`)
	return board
}

// function save(board, type = 'task', payload, groupId = null) {
// 	const groupIdx = board?.groups.findIndex((group) => group.id === groupId)
// 	switch (type) {
// 		case 'task':
// 			const taskIdx = board.groups[groupIdx].tasks.findIndex((task) => task.id === payload.id)
// 			if (taskIdx > -1) {
// 				board.groups[groupIdx].tasks.splice(taskIdx, 1, payload)[0]
// 			} else {
// 				board.groups[groupIdx].tasks.push(payload)
// 			}
// 			break
// 		case 'group':
// 			if (groupIdx > -1) {
// 				board.groups[groupIdx] = payload
// 			} else {
// 				board.groups.unshift(payload)
// 			}
// 			break
// 		case 'member':
// 			const memberIdx =
// 				type !== 'board' ? board?.members.findIndex((member) => member._id === payload._id) : -1
// 			if (memberIdx > -1) {
// 				board.members[memberIdx] = payload
// 			} else {
// 				board.members.push(payload)
// 			}
// 			break
// 	}
// 	return board
// 	// board.activities.unshift(activity)
// }

async function addGptBoard(boardObj) {
	try {
		let board
		const savedBoards = utilService.loadFromStorage(STORAGE_KEY) || []
		let currBoard = savedBoards.length
			? savedBoards.find((boards) => boards.title === boardObj.boardName)
			: null
		if (currBoard) {
			delete currBoard._id
			currBoard.createdBy = boardObj.createdBy
			currBoard.members = boardObj.members
			board = await saveBoard(currBoard)
			if (!board) throw new Error('Could not add board')
		} else {
			board = await httpService.post(API_KEY + 'gpt', boardObj)
			if (!board) throw new Error('Could not add board')
			savedBoards.push(board)
			utilService.saveToStorage(STORAGE_KEY, savedBoards)
		}
		return board
	} catch (err) {
		console.log('Error adding board with gpt:', err)
	}
}

async function saveBoard(board) {
	let savedBoard
	if (board._id) {
		savedBoard = await httpService.put(`${API_KEY}/${board._id}`, board)
	} else {
		savedBoard = await httpService.post(API_KEY, board)
	}
	socketService.emit(SOCKET_EVENT_CHANGE_BOARD, savedBoard)
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
		case 'createdBy':
			board.createdBy = val
			// board.members.push(val)
			break
	}
	return await saveBoard(board)
}

async function queryList(filterBy = { txt: '', userId: '' }) {
	try {
		let boardList = await httpService.get(API_KEY, filterBy)
		boardList = boardList.sort((a, b) => a.position - b.position)
		return boardList
	} catch (err) {
		console.log('queryList error:' + err)
	}
}

async function removeBoard(boardId) {
	try {
		return await httpService.delete(`board/${boardId}`)
	} catch (err) {
		console.log('removeBoard error:', err)
		throw err
	}
}

function filterByTxt(board, txt) {
	txt = txt.trim()
	if (!txt) return board
	const regex = new RegExp(txt, 'i')
	board.groups = board.groups.reduce((groupArr, group) => {
		group.tasks = group.tasks.reduce((taskArr, task) => {
			if (regex.test(task.title)) {
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
			if (task.person?.includes(memberId)) {
				taskArr.push(task)
			}
			return taskArr
		}, [])

		if (group.tasks?.length) groupArr.push(group)
		return groupArr
	}, [])
	return board
}
function setAdvanceFilter(board, advanceFilter) {
	board.groups = board.groups.reduce((groupArr, group) => {
		const groupInclude = advanceFilter.group?.length ? advanceFilter.group.includes(group.title) : true
		if (groupInclude) {
			group.tasks = group.tasks.reduce((taskArr, task) => {
				const priorityInclude = advanceFilter.priority.length
					? advanceFilter.priority.includes(task.priority)
					: true
				const statusInclude = advanceFilter.status.length
					? advanceFilter.status.includes(task.status)
					: true
				const personInclude = advanceFilter.person.length
					? advanceFilter.person.some((item) => task.person?.some((person) => person === item._id))
					: true
				if (priorityInclude && statusInclude && personInclude) {
					taskArr.push(task)
				}
				return taskArr
			}, [])
		} else {
			group.tasks = []
		}

		if (group.tasks?.length || groupInclude) groupArr.push(group)
		return groupArr
	}, [])
	return board
}
async function applyDrag(addedId, removedId, type, board, groupId) {
	switch (type) {
		case 'task':
			const groupIdx = board.groups.findIndex((group) => group.id === groupId)
			const addedIdx = board.groups[groupIdx].tasks.findIndex((task) => task.id === addedId)
			const removedIdx = board.groups[groupIdx].tasks.findIndex((task) => task.id === removedId)
			if (addedIdx !== -1 && removedIdx !== -1) {
				const temp = board.groups[groupIdx].tasks[addedIdx]
				board.groups[groupIdx].tasks[addedIdx] = board.groups[groupIdx].tasks[removedIdx]
				board.groups[groupIdx].tasks[removedIdx] = temp
			}
			return board
		case 'taskBetweenGroups':
			const groupAddedIdx = board.groups.findIndex((group) => group.id === addedId.addedGroupId)
			const addedTIdx = board.groups[groupAddedIdx].tasks.findIndex(
				(task) => task.id === addedId.addedId
			)
			const groupRemovedIdx = board.groups.findIndex((group) => group.id === removedId.removedGroupId)
			const removedTIdx = board.groups[groupRemovedIdx].tasks.findIndex(
				(task) => task.id === removedId.removedId
			)
			if (addedTIdx !== -1 && removedTIdx !== -1) {
				board.groups[groupAddedIdx].tasks.splice(
					addedTIdx,
					0,
					board.groups[groupRemovedIdx].tasks[removedTIdx]
				)
				board.groups[groupRemovedIdx].tasks.splice(removedTIdx, 1)
			}
			return board
		case 'group':
			const addedGroupIdx = board.groups.findIndex((group) => group.id === addedId)
			const removedGroupIdx = board.groups.findIndex((group) => group.id === removedId)
			if (addedGroupIdx !== -1 && removedGroupIdx !== -1) {
				const temp = board.groups[addedGroupIdx]
				board.groups[addedGroupIdx] = board.groups[removedGroupIdx]
				board.groups[removedGroupIdx] = temp
			}
			return board
		case 'board':
			const ids = { addedId, removedId }
			return await httpService.put(`board/drag`, ids)
	}
}

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
		isExpanded: true,
		archivedAt: null,
		tasks: [getEmptyTask(), getEmptyTask(), getEmptyTask()],
		style: {
			color: getRndColor(),
		},
	}
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

import demoBoardDev from '../../data/demoBoardDev.json' assert { type: 'json' }
import demoBoardFinance from '../../data/demoBoardFinance.json' assert { type: 'json' }
function getDemoFinance() {
	return demoBoardFinance
}
function getDemoDev() {
	return demoBoardDev
}
