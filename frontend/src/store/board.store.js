import { boardService } from '../services/board.service'
import { router } from '../router'
import { utilService } from '../services/util.service'
import { userService } from '../services/user.service'

export const boardStore = {
	state: {
		board: {},
		filteredBoard: {},
		boardList: [],
		filterBy: {
			txt: '',
			member: null,
		},
		advanceFilter: {
			person: [],
			group: [],
			priority: [],
			status: [],
			tasks: [],
		},
		requests: [],
		requestsNum: 1,
		isSwitchingBoards: false,
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
		advanceFilter({ advanceFilter }) {
			return advanceFilter
		},
		isSwitchingBoards({ isSwitchingBoards }) {
			return isSwitchingBoards
		},
	},
	mutations: {
		setIsSwitchingBoards(state, { isSwitchingBoards }) {
			state.isSwitchingBoards = isSwitchingBoards
		},
		addRequest(state, request) {
			state.requests.push(request)
		},
		removeRequest(state) {
			state.requests.shift()
		},
		setBoardList(state, { boardList }) {
			state.boardList = boardList
		},
		setBoard(state, { board }) {
			const sameBoard = board._id === state.board._id
			state.board = board
			state.filterBy = { txt: '', member: null }
			if (!sameBoard) {
				router.push(`/board/${board._id}/main-table`)
			}
		},
		addBoard(state, { board }) {
			const minBoard = { _id: board._id, title: board.title }
			state.boardList.push(minBoard)
			state.board = board
			state.filteredBoard = JSON.parse(JSON.stringify(state.board))
		},
		deleteBoard(state, { boardId }) {
			const idx = state.boardList.findIndex((board) => board._id === boardId)
			state.boardList = state.boardList.filter((board) => board._id !== boardId)
			if (idx > -1 && state.boardList.length === 1) state.board = state.boardList[idx - 1]
			state.filteredBoard = JSON.parse(JSON.stringify(state.board))
		},
		resetFilters(state) {
			state.filterBy = { txt: '', member: null }
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
		setAdvanceFilter(state, { advanceFilter }) {
			this.filterBy = { txt: '', member: null }
			let filterBoard = JSON.parse(JSON.stringify(state.board))
			filterBoard = boardService.setAdvanceFilter(filterBoard, advanceFilter)
			// console.log('filterBoard', filterBoard)
			state.filteredBoard = filterBoard
			state.advanceFilter = JSON.parse(JSON.stringify(advanceFilter))
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
		addRequestNum(state) {
			state.requestsNum++
		},
	},
	actions: {
		async dispatchRequest({ commit, state }) {
			while (state.requests.length > 0) {
				const request = state.requests[0]
				try {
					await request.dispatch()
				} catch (error) {
					console.error(error)
				}
				console.log(`request sent, number:`, state.requestsNum)
				commit('addRequestNum')
				commit('removeRequest')
			}
		},
		async enqueueRequest({ commit, dispatch, state }, request) {
			commit('addRequest', request)
			if (state.requests.length === 1) {
				await dispatch('dispatchRequest')
			}
		},
		async saveTask({ dispatch, state }, { payload }) {
			try {
				const { boardId, task, groupId } = payload
				const { attName, attValue, taskId } = task
				const taskToSave = JSON.parse(JSON.stringify(state.board.groups.find((group) => group.id === groupId).tasks.find((task) => task.id === taskId)))
				taskToSave[attName] = attValue
				const updatedBoard = await boardService.save(boardId, 'task', taskToSave, groupId)
				dispatch({ type: 'setAndFilterBoard', board: updatedBoard })
				return taskToSave
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
			try {
				const updatedBoard = await boardService.save(boardId, 'task', task, updatedGroupId)
				dispatch({ type: 'setAndFilterBoard', board: updatedBoard })
				return task
			} catch (err) {
				console.log('Store: Error in updateTask', err)
				throw err
			}
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
		async removeTasks({ commit, dispatch }, { ids }) {
			try {
				const updatedBoard = await boardService.remove(ids, 'tasks')
				dispatch({ type: 'setAndFilterBoard', board: updatedBoard })
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
				group[attName] = att
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
			if (!board?._id) return
			commit({ type: 'setBoard', board })
			const filterBy = state.filterBy
			const advanceFilter = state.advanceFilter
			if (Object.values(advanceFilter).some((arr) => Array.isArray(arr) && arr.length > 0)) {
				commit({ type: 'setAdvanceFilter', advanceFilter })
			} else {
				commit({ type: 'filterBoard', filterBy })
			}
		},
		async getBoardById({ dispatch, commit }, { boardId }) {
			try {
				const board = await boardService.getById(boardId)
				// commit({ type: 'resetFilters', board })
				await dispatch({ type: 'setAndFilterBoard', board })
				return board
			} catch (err) {
				console.log('Store: Error in getBoardById', err)
			}
		},
		async getFirstBoard({ dispatch, state }, { params }) {
			const boardId = !params ? state.boardList[0]._id : params
			const board = dispatch({ type: 'getBoardById', boardId })
			return board
		},

		async loadBoardList(context, { filterBy = { txt: '' } }) {
			try {
				filterBy.userId = context.getters.loggedinUser._id
				const boardList = await boardService.queryList(filterBy)
				context.commit({ type: 'setBoardList', boardList })
				return boardList
			} catch (err) {
				console.log('Store: Error in loadBoardList', err)
				throw err
			}
		},
		async addBoard({ commit, getters }) {
			try {
				const board = boardService.getEmptyBoard()
				const user = getters.loggedinUser
				board.createdBy = {
					_id: user._id,
					fullname: user.fullname,
					imgUrl: user.imgUrl,
				}
				board.members.push({
					_id: user._id,
					fullname: user.fullname,
					imgUrl: user.imgUrl,
				})

				const newBoard = await boardService.save(null, 'board', board)
				commit({ type: 'addBoard', board: newBoard })
				return newBoard
			} catch (err) {
				console.log('Store: Error in addBoard', err)
				throw err
			}
		},
		async addGptBoard({ commit, getters, state }, { boardName }) {
			commit({ type: 'setIsSwitchingBoards', isSwitchingBoards: true })
			try {
				const boardObj = {}
				boardObj.boardName = boardName
				const user = getters.loggedinUser
				boardObj.createdBy = {
					_id: user._id,
					fullname: user.fullname,
					imgUrl: user.imgUrl,
				}
				boardObj.members = [{
					_id: user._id,
					fullname: user.fullname,
					imgUrl: user.imgUrl,
				}]
				const newBoard = await boardService.addGptBoard(boardObj)
				commit({ type: 'addBoard', board: newBoard })
				commit({ type: 'setIsSwitchingBoards', setTo: false })
				return newBoard
			} catch (err) {
				console.log('Store: Error in addBoard', err)
				commit({ type: 'setIsSwitchingBoards', setTo: false })
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
					const miniBoards = await context.dispatch({ type: 'loadBoardList' })
					const miniBoardId = miniBoards[miniBoards.length - 1]._id
					context.dispatch({ type: 'getBoardById', boardId: miniBoardId })
				}
			} catch (err) {
				console.log('boardStore: Error in deleteBoard', err)
				throw err
			}
		},
		async updateBoard({ commit, getters, dispatch }, { payload }) {
			const { newBoardId } = payload
			const userId = JSON.parse(JSON.stringify(getters.loggedinUser))._id
			const boardId = newBoardId || getters.board._id
			const updatedBoard = await boardService.updateBoard(boardId, payload)
			dispatch({ type: 'setAndFilterBoard', board: updatedBoard })
			dispatch({ type: 'loadBoardList', filterBy: { userId } })
			return updatedBoard
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
				await boardService.applyDrag(addedId, removedId, 'board')
				await context.dispatch({ type: 'loadBoardList' })
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
			// console.log('savedBoard', savedBoard)
			dispatch({ type: 'setAndFilterBoard', board: savedBoard })
			dispatch({ type: 'loadBoardList' })
			return savedBoard
		},

		async getUserBoardList({ commit, dispatch, getters }) {
			const user = JSON.parse(JSON.stringify(getters.loggedinUser))
			const boards =
				(await dispatch({
					type: 'loadBoardList',
					filterBy: { userId: user._id },
				})) || []
			let firstBoard = boards[0] || null
			if (!firstBoard) {
				firstBoard = await dispatch({ type: 'addDemoBoards' })
				const payload = {
					type: 'createdBy',
					val: {
						_id: user._id,
						fullname: user.fullname,
						imgUrl: user.imgUrl,
					},
				}
				firstBoard = await dispatch({ type: 'updateBoard', payload })
				return firstBoard
			}
			commit({ type: 'setBoardList', boardList: boards })
			return firstBoard
		},
		async addDemoBoards({ commit, getters }) {
			try {
				const boardDev = boardService.getDemoDev()
				const boardFinance = boardService.getDemoFinance()
				const user = getters.loggedinUser
				boardDev.createdBy = {
					_id: user._id,
					fullname: user.fullname,
					imgUrl: user.imgUrl,
				}
				boardFinance.createdBy = {
					_id: user._id,
					fullname: user.fullname,
					imgUrl: user.imgUrl,
				}
				boardDev.members.push({
					_id: user._id,
					fullname: user.fullname,
					imgUrl: user.imgUrl,
				})
				boardFinance.members.push({
					_id: user._id,
					fullname: user.fullname,
					imgUrl: user.imgUrl,
				})
				const newBoardDev = await boardService.save(null, 'board', boardDev)
				const newBoardFinance = await boardService.save(null, 'board', boardFinance)
				commit({ type: 'addBoard', board: newBoardDev })
				commit({ type: 'addBoard', board: newBoardFinance })
				return newBoardDev
			} catch (err) {
				console.log('Store: Error in add demo boards', err)
				throw err
			}
		},
		async addMember(context, { userId }) {
			try {
				const member = await userService.getById(userId)
				const payload = { _id: member._id, fullname: member.fullname, imgUrl: member.imgUrl }
				const boardId = context.getters.board._id
				const updatedBoard = await boardService.save(boardId, 'member', payload)
				await context.dispatch({ type: 'setAndFilterBoard', board: updatedBoard })
			} catch (err) {
				console.log('boardStore: Error in add member', err)
				throw err
			}
		},
		async removeMember(context, { userId }) {
			try {
				const member = await userService.getById(userId)
				const boardId = context.getters.board._id
				const updatedBoard = await boardService.remove({ boardId, memberId: member._id }, 'member')
				await context.dispatch({ type: 'setAndFilterBoard', board: updatedBoard })
				// // // commit({ type: 'removeMember', memberId })
				// return member._id
			} catch (err) {
				console.log('boardStore: Error in removeMember', err)
				throw err
			}
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
