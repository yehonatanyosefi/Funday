import {boardService} from '../services/board.service'

export const boardStore = {
  state: {
    board: {},
    boardList: [],
  },
  getters: {
    board({board}) {
      return board
    },
    boardList({boardList}) {
      return boardList
    },
  },
  mutations: {
    setBoardList(state, {boardList}) {
      state.boardList = boardList
    },
    setBoard(state, {board}) {
      state.board = board
    },
    addBoard(state, {board}) {
      state.board = board
      const minBoard = {_id: board._id, title: board.title}
      state.boardList.push(minBoard)
    },
    deleteBoard(state, { boardId }){
        state.boardList = state.boardList.filter(board => board._id !== boardId)
    }
    // setTasks(state, { tasks }) {
    //     state.tasks = tasks
    // },
    // addTask(state, { task }) {
    //     state.tasks.push(task)
    // },
    // saveTask(state, { task }) {
    //     const idx = state.tasks.findIndex(c => c._id === task._id)
    //     state.tasks.splice(idx, 1, task)
    // },
    // removeTask(state, { taskId }) {
    //     state.tasks = state.tasks.filter(task => task._id !== taskId)
    // },
    // addTaskMsg(state, { taskId, msg }) {
    //     const task = state.tasks.find(task => task._id === taskId)
    //     if (!task.msgs) task.msgs = []
    //     task.msgs.push(msg)
    // },
    // setGroups(state, { groups }) {
    //     state.groups = groups
    // },
    // addGroup(state, { group }) {
    //     state.groups.push(group)
    // },
    // updateGroup(state, { group }) {
    //     const idx = state.groups.findIndex(c => c._id === group._id)
    //     state.groups.splice(idx, 1, group)
    // },
    // removeGroup(state, { groupId }) {
    //     state.groups = state.groups.filter(group => group._id !== groupId)
    // },
    // addGroupMsg(state, { groupId, msg }) {
    //     const group = state.groups.find(group => group._id === groupId)
    //     if (!group.msgs) group.msgs = []
    //     group.msgs.push(msg)
    // },
  },
  actions: {
    async saveTask(context, {payload}) {
      try {
        const {boardId, task, groupId} = payload
        const updatedBoard = await boardService.save(
          boardId,
          'task',
          task,
          groupId
        )
        context.commit({type: 'setBoard', board: updatedBoard})
        return task
      } catch (err) {
        console.log('Store: Error in updateTask', err)
        throw err
      }
    },
    async addTask({dispatch, getters}) {
      const task = boardService.getEmptyTask()
      const board = getters.board
      const boardId = board._id
      const groupId = board.groups[0].id
      const payload = {boardId, task, groupId}
      return dispatch({type: 'saveTask', payload})
    },
    async removeTask(context, {ids}) {
      try {
        const updatedBoard = await boardService.remove(ids, 'task')
        context.commit({type: 'setBoard', board: updatedBoard})
      } catch (err) {
        console.log('Store: Error in removeTask', err)
        throw err
      }
    },
    async getBoardById(context, {boardId}) {
      try {
        const board = await boardService.getById(boardId)
        context.commit({type: 'setBoard', board})
        return board
      } catch (err) {
        console.log('Store: Error in getBoardById', err)
      }
    },
    async getFirstBoard({dispatch, state}) {
      const boardId = state.boardList[0]._id
      dispatch({type: 'getBoardById', boardId})
      return boardId
    },
    async loadBoardList(context) {
      try {
        const boardList = await boardService.queryList()
        context.commit({type: 'setBoardList', boardList})
        return boardList
      } catch (err) {
        console.log('Store: Error in loadBoardList', err)
        throw err
      }
    },
    async addBoard({commit}) {
      try {
        const board = await boardService.getEmptyBoard()
        const newBoard = await boardService.save(null, 'board', board)
        commit({type: 'addBoard', board: newBoard})
        return newBoard
      } catch {
        console.log('Store: Error in addBoard', err)
        throw err
      }
    },
    async deleteBoard(context, { boardId }) {
        try {
            await boardService.remove({boardId}, 'board')
            context.commit({type:"deleteBoard",boardId})
            context.dispatch({type:"loadBoardList"})
        } catch (err) {
            console.log('boardStore: Error in deleteBoard', err)
            throw err
        }
    },
    async updateBoard({commit, getters, dispatch}, {payload}) {
      const boardId = getters.board._id
      const updatedBoard = await boardService.updateBoard(boardId, payload)
      commit({type: 'setBoard', board: updatedBoard})
      dispatch({type: 'loadBoardList'})
    },
    // async addGroup(context, { group }) {
    //     try {
    //         group = await boardService.saveGroup(group)
    //         context.commit(getActionAddGroup(group))
    //         return group
    //     } catch (err) {
    //         console.log('groupStore: Error in addGroup', err)
    //         throw err
    //     }
    // },
    // async updateGroup(context, { group }) {
    //     try {
    //         group = await boardService.saveGroup(group)
    //         context.commit(getActionUpdateGroup(group))
    //         return group
    //     } catch (err) {
    //         console.log('groupStore: Error in updateGroup', err)
    //         throw err
    //     }
    // },
    // async removeGroup(context, { groupId }) {
    //     try {
    //         await boardService.removeGroup(groupId)
    //         context.commit(getActionRemoveGroup(groupId))
    //     } catch (err) {
    //         console.log('groupStore: Error in removeGroup', err)
    //         throw err
    //     }
    // },
    // async addGroupMsg(context, { groupId, txt }) {
    //     try {
    //         const msg = await boardService.addGroupMsg(groupId, txt)
    //         context.commit({ type: 'addGroupMsg', groupId, msg })
    //     } catch (err) {
    //         console.log('groupStore: Error in addGroupMsg', err)
    //         throw err
    //     }
    // },
  },
}
