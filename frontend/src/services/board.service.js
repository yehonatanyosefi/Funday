import { storageService } from './async-storage.service.js'
import { httpService } from './http.service.js'
import { utilService } from './util.service.js'
import { userService } from './user.service.js'

const STORAGE_KEY = 'boardDB'

export const boardService = {
    query,
    getById,
    update,
    remove,
    addMsg,
    getEmptyBoard,
    getEmptyGroup,
    getEmptyTask,
}
window.cs = boardService

_createDemoData()

function getById(boardId) {
    return storageService.get(STORAGE_KEY, boardId)
    // return httpService.get(`boardId/${boardId}`)
}

async function update(boardId, type = 'task', payload, groupId = null) {
    let board = await getById(boardId)
    const groupIdx = board.groups.findIndex(group => group.id === groupId)
    switch (type) {
        case 'task':
            const taskIdx = board.groups[groupIdx].tasks.findIndex(task => task.id === payload.id)
            const tasks = board.groups[groupIdx].tasks.splice(taskIdx, 1, payload)[0]
            const group = board.groups.splice(groupIdx, 1, tasks)[0]
            // board.groups[groupIdx].tasks.push(payload)
            board.groups[groupIdx] = group
            break
        case 'group':
            board.groups[groupIdx] = payload
            // board.groups.push(payload)
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

async function query(type = 'groups', filterBy = { txt: '', price: 0 }) {
    // return httpService.get(STORAGE_KEY, filterBy)

    const board = await storageService.query(STORAGE_KEY) //TODO refactor
    let entity = board
    switch (type) {
        case 'groups':
            entity = board[0].groups
            break
        case 'tasks':
            entity = board[0].groups[0].tasks
            break
    }
    // var tasks = await storageService.query(STORAGE_KEY)
    // if (filterBy.txt) {
    //     const regex = new RegExp(filterBy.txt, 'i')
    //     tasks = tasks.filter(task => regex.test(task.vendor) || regex.test(task.description))
    // }
    // if (filterBy.price) {
    //     tasks = tasks.filter(task => task.price <= filterBy.price)
    // }
    // return tasks
    return entity
}

async function remove(ids, type) {
    const { boardId, groupId, taskId } = ids
    let board = await getById(boardId)
    switch (type) {
        case 'task':
            const groupIdx = board.groups.findIndex(group => group.id === groupId)
            const taskIdx = board.groups[groupIdx].tasks.findIndex(task => task.id === taskId)
            const tasks = board.groups[groupIdx].tasks.splice(taskIdx, 1)[0]
            const group = board.groups.splice(groupIdx, 1, tasks)[0]
            // board.groups[groupIdx].tasks.push(payload)
            board.groups[groupIdx] = group
            return await saveBoard(board)
            break
        case 'groups':
            board = board.groups
            return Promise.resolve()
            break
        case 'board':
            return await storageService.remove(STORAGE_KEY, id)
            // return httpService.delete(`task/${taskId}`)
            break
    }
}

async function addMsg(taskId, txt) {
    const savedMsg = await httpService.post(`task/${taskId}/msg`, { txt })
    return savedMsg
}

async function saveGroup(group) {
    var savedGroup
    if (group._id) {
        savedGroup = await storageService.put(STORAGE_KEY, group)
        // savedGroup = await httpService.put(`group/${group._id}`, group)

    } else {
        // Later, owner is set by the backend
        group.owner = userService.getLoggedinUser()
        savedGroup = await storageService.post(STORAGE_KEY, group)
        // savedGroup = await httpService.post('group', group)
    }
    return savedGroup
}

async function queryGroup(filterBy = { txt: '', price: 0 }) {
    // return httpService.get(STORAGE_KEY, filterBy)
    const board = await storageService.query(STORAGE_KEY)
    let groups = board[0].groups
    // if (filterBy.txt) {
    //     const regex = new RegExp(filterBy.txt, 'i')
    //     groups = groups.filter(group => regex.test(group.vendor) || regex.test(group.description))
    // }
    // if (filterBy.price) {
    //     groups = groups.filter(group => group.price <= filterBy.price)
    // }
    return groups

}
function getGroupById(groupId) {
    return storageService.get(STORAGE_KEY, groupId)
    // return httpService.get(`group/${groupId}`)
}

async function removeGroup(groupId) {
    await storageService.remove(STORAGE_KEY, groupId)
    // return httpService.delete(`group/${groupId}`)
}

function getEmptyTask() {
    return {
        id: '',
        title: '',
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
            imgUrl: ''
        },
        style: {
            bgColor: ''
        }
    }
}

function getEmptyGroup() {
    return {
        id: utilService.makeId(),
        title: 'Title',
        archivedAt: null,
        tasks: [getEmptyTask(), getEmptyTask(),],
        style: {}
    }
}

async function getEmptyBoard() {
    return {
        _id: '',
        title: '',
        isStarred: false,
        archivedAt: '',
        createdBy: {
            _id: '',
            fullname: '',
            imgUrl: '',
        },
        style: {},
        labels: [],
        members: [],
        groups: getEmptyGroup(),
    }
}

import jsonBoard from '../../data/board.json' assert {type: 'json'};
function _createDemoData() {
    const board = utilService.loadFromStorage(STORAGE_KEY)
    if (!board) {
        utilService.saveToStorage(STORAGE_KEY, jsonBoard)
    }
}