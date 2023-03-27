import { boardService } from '../services/board.service'
import { router } from '../router'
import { toRefs } from 'vue'
import { utilService } from '../services/util.service'
import { useFavicon } from '@vueuse/core'

export const boardStore = {
	state: {
		board: {},
		filteredBoard: {},
		boardList: [],
		filterBy: {
			txt: '',
			member: null,
		},
	},
	getters: {
		board({ board }) {
			return board
		},
		filteredBoard({ filteredBoard }) {
			return filteredBoard
		},
		boardList({ boardList }) {
			return boardList
		},
		filterBy({ filterBy }) {
			return filterBy
		},
	},
	mutations: {
		setBoardList(state, { boardList }) {
			state.boardList = boardList
		},
		setBoard(state, { board }) {
			state.board = board
			state.filterBy = { txt: '', member: null }
			router.push(`/board/${board._id}/main-table`)
		},
		addBoard(state, { board }) {
			const minBoard = { _id: board._id, title: board.title }
			state.boardList = [...state.boardList, minBoard]
			state.board = board
			state.filteredBoard = JSON.parse(JSON.stringify(state.board))
		},
		deleteBoard(state, { boardId }) {
			const idx = state.boardList.findIndex((board) => board._id === boardId)
			state.boardList = state.boardList.filter((board) => board._id !== boardId)
			if (idx > -1 && state.boardList.length === 1) state.board = state.boardList[idx - 1]
			state.filteredBoard = JSON.parse(JSON.stringify(state.board))
		},
		filterBoard(state, { filterBy }) {
			let filter = !filterBy ? state.filterBy : filterBy

			filter.txt = filterBy.txt || ''
			filter.member = filterBy.member || null

			let filterBoard = JSON.parse(JSON.stringify(state.board))
			if (filter.txt !== '') {
				filterBoard = boardService.filterByTxt(filterBoard, filter.txt)
			}
			if (filter.member) {
				filterBoard = boardService.filterByMember(filterBoard, filter.member)
			}
			state.filteredBoard = filterBoard
			state.filterBy = filter
		},
		removeTask(state, { ids }) {
			const { groupId, taskId } = ids
			const groupIdx = state.board.groups.findIndex((group) => group.id === groupId)
			const taskIdx = state.board.groups[groupIdx].tasks.findIndex((task) => task.id === taskId)
			state.board.groups[groupIdx].tasks.splice(taskIdx, 1)
			state.filteredBoard.groups[groupIdx].tasks.splice(taskIdx, 1)
		},
		removeGroup(state, { groupId }) {
			const groupIdx = state.board.groups.findIndex((group) => group.id === groupId)
			state.board.groups.splice(groupIdx, 1)
			state.board.groups.splice(groupIdx, 1)
			state.filteredBoard.groups.splice(groupIdx, 1)
		},
		// saveTask({ board }, { payload }) {
		// 	const { task, groupId } = payload
		// 	const groupIdx = board.groups.findIndex(group => group.id === groupId)
		// 	const taskIdx = board.groups[groupIdx].tasks.findIndex(task => task.id === task.id)
		// 	if (taskIdx > -1) {
		// 		board.groups[groupIdx].tasks.splice(taskIdx, 1, task)
		// 	} else {
		// 		board.groups[groupIdx].tasks.push(task)
		// 	}
		// },
		// saveGroup(state, { groups }) {
		// 	state.groups = groups
		// },
		// addGroup(state, { group }) {
		//     state.groups.push(group)
		// },
		// updateGroup(state, { group }) {
		//     const idx = state.groups.findIndex(c => c._id === group._id)
		//     state.groups.splice(idx, 1, group)
		// },
		// addGroupMsg(state, { groupId, msg }) {
		//     const group = state.groups.find(group => group._id === groupId)
		//     if (!group.msgs) group.msgs = []
		//     group.msgs.push(msg)
		// },
	},
	actions: {
		async saveTask({ dispatch }, { payload }) {
			try {
				const { boardId, task, groupId } = payload
				const updatedBoard = await boardService.save(boardId, 'task', task, groupId)
				dispatch({ type: 'setAndFilterBoard', board: updatedBoard })
				return task
			} catch (err) {
				console.log('Store: Error in updateTask', err)
				throw err
			}
		},
		async addTask({ dispatch, getters }, { payload = { groupId: null, title: null } }) {
			const { groupId, title } = payload
			const task = boardService.getEmptyTask()
			if (title) task.title = title
			const board = getters.board
			const boardId = board._id
			const updatedGroupId = !groupId ? board.groups[0].id : groupId
			const newPayload = { boardId, task, groupId: updatedGroupId }
			return dispatch({ type: 'saveTask', payload: newPayload })
		},
		async removeTask({ commit, dispatch }, { ids }) {
			try {
				const updatedBoard = await boardService.remove(ids, 'task')
				dispatch({ type: 'setAndFilterBoard', board: updatedBoard })
				// commit({ type: 'removeTask', ids })
			} catch (err) {
				console.log('Store: Error in removeTask', err)
				throw err
			}
		},
		async addGroup({ dispatch, getters }) {
			const group = boardService.getEmptyGroup()
			const boardId = getters.board._id
			const updatedBoard = await boardService.save(boardId, 'group', group)
			dispatch({ type: 'setAndFilterBoard', board: updatedBoard })
		},
		async removeGroup({ commit, dispatch }, { payload }) {
			try {
				const { groupId, boardId } = payload
				const updatedBoard = await boardService.remove({ boardId, groupId }, 'group')
				dispatch({ type: 'setAndFilterBoard', board: updatedBoard })
				// commit({ type: 'removeGroup', groupId })
				return groupId
			} catch (err) {
				console.log('boardStore: Error in deleteBoard', err)
				throw err
			}
		},
		async saveGroupAtt({ state, dispatch }, { payload }) {
			try {
				const { attName, boardId, att, groupId } = payload
				const group = JSON.parse(
					JSON.stringify(state.board.groups.find((group) => group.id === groupId))
				)
				if (!group) throw new Error('No group')
				if (attName === 'style') group.style.color = att
				else group[attName] = att
				const updatedBoard = await boardService.save(boardId, 'group', group, groupId)
				dispatch({ type: 'setAndFilterBoard', board: updatedBoard })
				return group
			} catch (err) {
				console.log('Store: Error in saveGroup', err)
				throw err
			}
		},
		async saveGroup(context, { payload }) {
			try {
				const { boardId, group, groupId } = payload
				const updatedBoard = await boardService.save(boardId, 'group', group, groupId)
				dispatch({ type: 'setAndFilterBoard', board: updatedBoard })
				return group
			} catch (err) {
				console.log('Store: Error in saveGroup', err)
				throw err
			}
		},
		setAndFilterBoard({ commit, state }, { board }) {
			commit({ type: 'setBoard', board })
			const filterBy = state.filterBy
			commit({ type: 'filterBoard', filterBy })
		},
		async getBoardById({ dispatch }, { boardId }) {
			try {
				const board = await boardService.getById(boardId)
				dispatch({ type: 'setAndFilterBoard', board })
				return board
			} catch (err) {
				console.log('Store: Error in getBoardById', err)
			}
		},
		async getFirstBoard({ dispatch, state }, { params }) {
			const boardId = !params ? state.boardList[0]._id : params
			dispatch({ type: 'getBoardById', boardId })
			return boardId
		},
		async loadBoardList(context, { filterBy }) {
			try {
				const boardList = await boardService.queryList(filterBy)
				context.commit({ type: 'setBoardList', boardList })
				return boardList
			} catch (err) {
				console.log('Store: Error in loadBoardList', err)
				throw err
			}
		},
		async addBoard({ commit }) {
			try {
				const board = boardService.getEmptyBoard()
				const newBoard = await boardService.save(null, 'board', board)
				commit({ type: 'addBoard', board: newBoard })
				return newBoard
			} catch {
				console.log('Store: Error in addBoard', err)
				throw err
			}
		},
		async deleteBoard(context, { boardId }) {
			try {
				// console.log('context.state.boardList',[JSON.parse(JSON.stringify(context.state.boardList))])
				const boardListCopy = JSON.parse(JSON.stringify(context.state.boardList))
				if (boardListCopy.length > 1) {
					await boardService.remove({ boardId }, 'board')
					context.commit({ type: 'deleteBoard', boardId })
					context.dispatch({ type: 'loadBoardList' })
				}
			} catch (err) {
				console.log('boardStore: Error in deleteBoard', err)
				throw err
			}
		},
		async updateBoard({ commit, getters, dispatch }, { payload }) {
			const boardId = getters.board._id
			const updatedBoard = await boardService.updateBoard(boardId, payload)
			dispatch({ type: 'setAndFilterBoard', board: updatedBoard })
			dispatch({ type: 'loadBoardList' })
		},
		async applyTaskDrag({ dispatch }, { payload }) {
			try {
				const { addedId, removedId, boardId, groupId } = payload
				const updatedBoard = await boardService.applyDrag(addedId, removedId, 'task', boardId, groupId)
				dispatch({ type: 'setAndFilterBoard', board: updatedBoard })
				return true
			} catch (err) {
				console.log('Store: Error in apply task drag', err)
				throw err
			}
		},
		async applyGroupDrag({ dispatch }, { payload }) {
			try {
				const { addedId, removedId, boardId } = payload
				const updatedBoard = await boardService.applyDrag(addedId, removedId, 'group', boardId)
				dispatch({ type: 'setAndFilterBoard', board: updatedBoard })
				return true
			} catch (err) {
				console.log('Store: Error in apply group drag', err)
				throw err
			}
		},
		async applyBoardDrag(context, { payload }) {
			try {
				const { addedId, removedId } = payload
				const boardList = await boardService.applyDrag(addedId, removedId, 'board')
				context.commit({ type: 'setBoardList', boardList })
				return true
			} catch (err) {
				console.log('Store: Error in apply board drag', err)
				throw err
			}
		},
		async duplicateBoard({ commit, dispatch }, { board }) {
			const dupBoard = JSON.parse(JSON.stringify(board))
			dupBoard.groups.forEach((group) => {
				group.id = utilService.makeId()
				group.tasks.map((task) => (task.id = utilService.makeId()))
				return group
			})
			const savedBoard = await boardService.saveBoard(dupBoard)
			console.log('savedBoard', savedBoard)
			dispatch({ type: 'setAndFilterBoard', board: savedBoard })
			dispatch({ type: 'loadBoardList' })
			return savedBoard
		},
		// async addGroupMsg(context, { groupId, txt }) {
		//     try {
		//         const msg = await boardService.addGroupMsg(groupId, txt)
		//         context.commit({ type: 'addGroupMsg', groupId, msg })
		//     } catch (err) {
		// // //         console.log('groupStore: Error in addGroupMsg', err)
		//         throw err
		//     }
		// },
	},
}
