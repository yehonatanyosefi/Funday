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
			const minBoard = { _id: board._id, title: board.title, position: board.position || 20 }
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
			if (filter.member?._id) {
				filterBoard = boardService.filterByMember(filterBoard, filter.member)
			}
			state.filteredBoard = JSON.parse(JSON.stringify(filterBoard))
			state.filterBy = filter
		},
		setAdvanceFilter(state, { advanceFilter }) {
			this.filterBy = { txt: '', member: null }
			let filterBoard = JSON.parse(JSON.stringify(state.board))
			filterBoard = boardService.setAdvanceFilter(filterBoard, advanceFilter)
			state.filteredBoard = filterBoard
			state.advanceFilter = JSON.parse(JSON.stringify(advanceFilter))
		},
		removeTask(state, { ids }) {
			const board = state.board
			const { groupId, taskId } = ids
			const groupIdx = board.groups.findIndex((group) => group.id === groupId)
			const taskIdx = board.groups[groupIdx].tasks.findIndex((task) => task.id === taskId)
				const tasks = board.groups[groupIdx].tasks.splice(taskIdx, 1)[0]
				const group = board.groups.splice(groupIdx, 1, tasks)[0]
				board.groups[groupIdx] = group
		},
		removeTasks(state, { ids }) {
			const {groupId, taskId, tasksToRemove} = ids
			const board = state.board
			for (let groupId in tasksToRemove) {
				const groupIdx = board.groups.findIndex((group) => group.id === groupId)
				const tasks = board.groups[groupIdx].tasks.filter((task) => {
					return !tasksToRemove[groupId].some((selectedTask) => {
						return selectedTask.taskId === task.id
					})
				})
				if (!tasks.length) {
					board.groups.splice(groupIdx, 1)
					if (!board.groups.length) board.groups = [getEmptyGroup()]
				} else board.groups[groupIdx].tasks = tasks
			}
		},
		removeGroup({board, filteredBoard}, { groupId }) {
			const groupIdx = state.board.groups.findIndex((group) => group.id === groupId)
			board.groups.splice(groupIdx, 1)
			filteredBoard.groups.splice(groupIdx, 1)
		},
		removeMember({board},{userId}) {
			const memberIdx = board.members.findIndex((member) => member._id === userId)
			board.members.splice(memberIdx, 1)
		},
		saveTask({board},{payload}) {
				const { task, groupId } = payload
				const { attName, attValue, taskId } = task
				const groupIdx = board?.groups.findIndex((group) => group.id === groupId)
				const taskIdx = board.groups[groupIdx].tasks.findIndex((task) => task.id === taskId)
				if (taskIdx > -1) {
					board.groups[groupIdx].tasks[taskIdx][attName] = attValue
				} else {
					board.groups[groupIdx].tasks.push(payload.task)
			}

		},
		saveGroup({board},{payload}) {
				const { attName, att, groupId } = payload
	const groupIdx = board?.groups.findIndex((group) => group.id === groupId)
			if (groupIdx > -1) {
				board.groups[groupIdx][attName] = att
			} else {
				board.groups.unshift(payload)
			}
		},
		saveMember({board},{payload}) {
			const memberIdx = board?.members.findIndex((member) => member._id === payload._id)
			if (memberIdx > -1) {
				console.log('hi')
				board.members[memberIdx] = payload
			} else {
				board.members.push(payload)
			}
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
				commit('removeRequest')
			}
		},
		async enqueueRequest({ commit, dispatch, state }, request) {
			commit('addRequest', request)
			if (state.requests.length === 1) {
				await dispatch('dispatchRequest')
			}
		},
		async saveTask({ dispatch, state, commit }, { payload }) {
			try {
				commit({type:'saveTask',payload})
				dispatch({type:'filterBoard'})
				await boardService.saveBoard(state.board)
			} catch (err) {
				console.log('Store: Error in updateTask', err)
				throw err
			}
		},
		async addTask({ dispatch }, { payload = { groupId: null, title: null } }) {
			try {
			const { groupId, title } = payload
			const task = boardService.getEmptyTask()
			if (title) task.title = title
			const newPayload = {task, groupId}
dispatch({type:'saveTask',payload: newPayload})
			} catch (err) {
				console.log('Store: Error in addTask', err)
				throw err
			}
		},
		async removeTask({ state, dispatch, commit }, { ids }) {
			try {
				commit({type:'removeTask',ids})
				dispatch({type:'filterBoard'})
				await boardService.saveBoard(state.board)
			} catch (err) {
				console.log('Store: Error in removeTask', err)
				throw err
			}
		},
		async removeTasks({ state, dispatch, commit }, { ids }) {
			try {
				commit({type:'removeTasks',ids})
				dispatch({type:'filterBoard'})
				await boardService.saveBoard(state.board)
			} catch (err) {
				console.log('Store: Error in removeTask', err)
				throw err
			}
		},
		async addGroup({ dispatch, state, commit }) {
			try {
			const payload = boardService.getEmptyGroup()
				commit({type:'saveGroup',payload})
				dispatch({type:'filterBoard'})
				await boardService.saveBoard(state.board)
			} catch (err) {
				console.log('boardStore: Error in addGroup', err)
				throw err
			}
		},
		async removeGroup({ commit, dispatch }, { payload }) {
			try {
				commit({type:'removeTasks',payload})
				dispatch({type:'filterBoard'})
				await boardService.saveBoard(updatedBoard)
			} catch (err) {
				console.log('boardStore: Error in deleteBoard', err)
				throw err
			}
		},
		async saveGroupAtt({ state, dispatch, commit }, { payload }) {
			try {
				commit({type:'saveGroup',payload})
				dispatch({type:'filterBoard'})
				await boardService.saveBoard(state.board)
			} catch (err) {
				console.log('Store: Error in saveGroup', err)
				throw err
			}
		},
		async saveGroup({state, commit, dispatch}, { payload }) {
			try {
				commit({type:'saveGroup',payload})
				dispatch({type:'filterBoard'})
				await boardService.saveBoard(state.board)
			} catch (err) {
				console.log('Store: Error in saveGroup', err)
				throw err
			}
		},
		filterBoard({commit,state}) {
			const filterBy = state.filterBy
			const advanceFilter = state.advanceFilter
			if (Object.values(advanceFilter).some((arr) => Array.isArray(arr) && arr.length > 0)) {
				commit({ type: 'setAdvanceFilter', advanceFilter })
			} else {
				commit({ type: 'filterBoard', filterBy })
			}
		},
		setAndFilterBoard({ commit, dispatch }, { board }) {
			if (!board?._id) return
			commit({ type: 'setBoard', board })
			dispatch({type:'filterBoard'})
		},
		async getBoardById({ dispatch, commit }, { boardId }) {
			commit({ type: 'setIsSwitchingBoards', isSwitchingBoards: true })
			try {
				const board = await boardService.getById(boardId)
				// commit({ type: 'resetFilters', board })
				dispatch({ type: 'setAndFilterBoard', board })
				commit({ type: 'setIsSwitchingBoards', isSwitchingBoards: false })
				return board
			} catch (err) {
				console.log('Store: Error in getBoardById', err)
			}
		},
		async getFirstBoard({ dispatch, state }, { params }) {
			if (!state.boardList.length) await dispatch({ type: 'loadBoardList' })
			const boardId =
				params && state.boardList.some((board) => board._id === params)
					? params
					: state.boardList[0]?._id
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

				const newBoard = await boardService.saveBoard(board)
				commit({ type: 'addBoard', board: newBoard })
				return newBoard
			} catch (err) {
				console.log('Store: Error in addBoard', err)
				throw err
			}
		},
		async addGptBoard({ commit, getters }, { boardName }) {
			commit({ type: 'setIsSwitchingBoards', isSwitchingBoards: true })
			try {
				const user = getters.loggedinUser
				const boardObj = {}
				boardObj.boardName = boardName
				boardObj.createdBy = {
					_id: user._id,
					fullname: user.fullname,
					imgUrl: user.imgUrl,
				}
				boardObj.members = [
					{
						_id: user._id,
						fullname: user.fullname,
						imgUrl: user.imgUrl,
					},
				]
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
				const boardListCopy = JSON.parse(JSON.stringify(context.state.boardList))
				if (boardListCopy.length > 1) {
					await boardService.removeBoard(boardId)
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
		async updateBoard({ getters, dispatch }, { payload }) {
			try {
				const { newBoardId } = payload
				const userId = JSON.parse(JSON.stringify(getters.loggedinUser))._id
				const boardId = newBoardId || getters.board._id
				const updatedBoard = await boardService.updateBoard(boardId, payload)
				if (!updatedBoard) return
				dispatch({ type: 'setAndFilterBoard', board: updatedBoard })
				dispatch({ type: 'loadBoardList', filterBy: { userId } })
				return updatedBoard
			} catch (err) {
				console.error('error in updateBoard:',err)
				throw err
			}
		},
		async applyTaskDragBetweenGroups({ dispatch, state }, { payload }) {
			try {
				const { addedIds, removedIds } = payload
				const updatedBoard = await boardService.applyDrag(
					addedIds,
					removedIds,
					'taskBetweenGroups',
					JSON.parse(JSON.stringify(state.board))
				)
				dispatch({ type: 'setAndFilterBoard', board: updatedBoard })
				await boardService.saveBoard(updatedBoard)
			} catch (err) {
				console.log('Store: Error in apply task drag', err)
				throw err
			}
		},
		async applyTaskDrag({ dispatch, state }, { payload }) {
			try {
				const { addedId, removedId, groupId } = payload
				const updatedBoard = await boardService.applyDrag(
					addedId,
					removedId,
					'task',
					JSON.parse(JSON.stringify(state.board)),
					groupId
				)
				dispatch({ type: 'setAndFilterBoard', board: updatedBoard })
				await boardService.saveBoard(updatedBoard)
			} catch (err) {
				console.log('Store: Error in apply task drag', err)
				throw err
			}
		},
		async applyGroupDrag({ dispatch, state }, { payload }) {
			try {
				const { addedId, removedId } = payload
				const updatedBoard = await boardService.applyDrag(
					addedId,
					removedId,
					'group',
					JSON.parse(JSON.stringify(state.board))
				)
				dispatch({ type: 'setAndFilterBoard', board: updatedBoard })
				await boardService.saveBoard(updatedBoard)
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
			} catch (err) {
				console.log('Store: Error in apply board drag', err)
				throw err
			}
		},
		async duplicateBoard({ dispatch }, { board }) {
			const dupBoard = JSON.parse(JSON.stringify(board))
			dupBoard.groups.forEach((group) => {
				group.id = utilService.makeId()
				group.tasks.map((task) => (task.id = utilService.makeId()))
				return group
			})
			const savedBoard = await boardService.saveBoard(dupBoard)
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
				commit({ type: 'addBoard', board: newBoardDev })
				commit({ type: 'addBoard', board: newBoardFinance })
				const newBoardDev = await boardService.saveBoard(boardDev)
				const newBoardFinance = await boardService.saveBoard(boardFinance)
				return newBoardDev
			} catch (err) {
				console.log('Store: Error in add demo boards', err)
				throw err
			}
		},
		async addMember({commit, dispatch, state}, { userId }) {
			try {
				const member = await userService.getById(userId)
				const payload = { _id: member._id, fullname: member.fullname, imgUrl: member.imgUrl }
commit({type:'saveMember',payload})
dispatch({type:'filterBoard'})
await boardService.saveBoard(state.board)
				// const board = JSON.parse(JSON.stringify(state.board))
				// const updatedBoard = boardService.save(board, 'member', payload)
				// dispatch({ type: 'setAndFilterBoard', board: updatedBoard })
				// const savedBoard = await boardService.saveBoard(updatedBoard)
			} catch (err) {
				console.log('boardStore: Error in add member', err)
				throw err
			}
		},
		async removeMember({state, dispatch, commit}, { userId }) {
			try {
				commit({ type: 'removeMember', userId })
				dispatch({ type: 'filterBoard' })
				await boardService.saveBoard(state.board)
				// const member = await userService.getById(userId)
// 	const board = JSON.parse(JSON.stringify(state.board))
// 	const updatedBoard = boardService.remove({ board, memberId: member._id }, 'member')
// 	dispatch({ type: 'setAndFilterBoard', board: updatedBoard })
//   const savedBoard = await boardService.saveBoard(updatedBoard)
			} catch (err) {
				console.log('boardStore: Error in removeMember', err)
				throw err
			}
		},
	},
}
