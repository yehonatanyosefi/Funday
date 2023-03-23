import { boardService } from '../services/board.service'

export const boardStore = {
    state: {
        tasks: [],
        groups: [],
        board: [],
    },
    getters: {
        tasks({ tasks }) { return tasks },
        groups({ groups }) { return groups },
    },
    mutations: {
        setTasks(state, { tasks }) {
            state.tasks = tasks
        },
        addTask(state, { task }) {
            state.tasks.push(task)
        },
        updateTask(state, { task }) {
            const idx = state.tasks.findIndex(c => c._id === task._id)
            state.tasks.splice(idx, 1, task)
        },
        removeTask(state, { taskId }) {
            state.tasks = state.tasks.filter(task => task._id !== taskId)
        },
        addTaskMsg(state, { taskId, msg }) {
            const task = state.tasks.find(task => task._id === taskId)
            if (!task.msgs) task.msgs = []
            task.msgs.push(msg)
        },
        setGroups(state, { groups }) {
            state.groups = groups
        },
        addGroup(state, { group }) {
            state.groups.push(group)
        },
        updateGroup(state, { group }) {
            const idx = state.groups.findIndex(c => c._id === group._id)
            state.groups.splice(idx, 1, group)
        },
        removeGroup(state, { groupId }) {
            state.groups = state.groups.filter(group => group._id !== groupId)
        },
        addGroupMsg(state, { groupId, msg }) {
            const group = state.groups.find(group => group._id === groupId)
            if (!group.msgs) group.msgs = []
            group.msgs.push(msg)
        },
        updateBoard(state, { updatedBoard }) {
            state.board = updatedBoard
            state.groups = updatedBoard.groups
        }
    },
    actions: {
        async updateTask(context, { payload }) {
            try {
                const { boardId, task, groupId } = payload
                const updatedBoard = await boardService.update(boardId, 'task', task, groupId)
                context.commit({ type: 'updateBoard', updatedBoard })
                return task
            } catch (err) {
                console.log('taskStore: Error in updateTask', err)
                throw err
            }
        },
        async removeTask(context, { ids }) {
            try {
                const updatedBoard = await boardService.remove(ids, 'task')
                context.commit({ type: 'updateBoard', updatedBoard })
            } catch (err) {
                console.log('taskStore: Error in removeTask', err)
                throw err
            }
        },
        async addTask(context, { task }) {
            try {
                task = await boardService.saveTask(task, 'task')
                context.commit(getActionAddTask(task))
                return task
            } catch (err) {
                console.log('taskStore: Error in addTask', err)
                throw err
            }
        },
        async saveTask({ commit }, { boardId, groupId, task, activity }) {
            try {
                board = boardService.saveTask(boardId, groupId, task, activity)
                // commit(ACTION)
            } catch (err) {
                console.log('taskStore: Error in save task', err)
                throw err
            }
        },
        async loadTasks(context) {
            try {
                // const tasks = await boardService.queryTask()
                // context.commit({ type: 'setTasks', tasks })
            } catch (err) {
                console.log('taskStore: Error in loadTasks', err)
                throw err
            }
        },
        async addTaskMsg(context, { taskId, txt }) {
            try {
                const msg = await boardService.addTaskMsg(taskId, txt)
                context.commit({ type: 'addTaskMsg', taskId, msg })
            } catch (err) {
                console.log('taskStore: Error in addTaskMsg', err)
                throw err
            }
        },
        async saveGroup({ commit }, { boardId, groupId, group, activity }) {
            try {
                board = boardService.saveGroup(boardId, groupId, group, activity)
                // commit(ACTION)
            } catch (err) {
                console.log('groupStore: Error in save group', err)
                throw err
            }
        },
        async addGroup(context, { group }) {
            try {
                group = await boardService.saveGroup(group)
                context.commit(getActionAddGroup(group))
                return group
            } catch (err) {
                console.log('groupStore: Error in addGroup', err)
                throw err
            }
        },
        async updateGroup(context, { group }) {
            try {
                group = await boardService.saveGroup(group)
                context.commit(getActionUpdateGroup(group))
                return group
            } catch (err) {
                console.log('groupStore: Error in updateGroup', err)
                throw err
            }
        },
        async loadGroups(context) {
            try {
                const groups = await boardService.query('groups')
                context.commit({ type: 'setGroups', groups })
            } catch (err) {
                console.log('groupStore: Error in loadGroups', err)
                throw err
            }
        },
        async removeGroup(context, { groupId }) {
            try {
                await boardService.removeGroup(groupId)
                context.commit(getActionRemoveGroup(groupId))
            } catch (err) {
                console.log('groupStore: Error in removeGroup', err)
                throw err
            }
        },
        // async addGroupMsg(context, { groupId, txt }) {
        //     try {
        //         const msg = await boardService.addGroupMsg(groupId, txt)
        //         context.commit({ type: 'addGroupMsg', groupId, msg })
        //     } catch (err) {
        //         console.log('groupStore: Error in addGroupMsg', err)
        //         throw err
        //     }
        // },
    }
}