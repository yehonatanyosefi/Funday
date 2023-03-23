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

async function save(boardId = null, type = 'task', payload, groupId = null) {
  let board = (type !== 'board') ? await getById(boardId) : payload
  const groupIdx = (type !== 'board') ? board?.groups.findIndex((group) => group.id === groupId) : -1
  switch (type) {
    case 'task':
      const taskIdx = board.groups[groupIdx].tasks.findIndex(task => task.id === payload.id)
      if (taskIdx > -1) {
        const tasks = board.groups[groupIdx].tasks.splice(taskIdx, 1, payload)[0]
        const group = board.groups.splice(groupIdx, 1, tasks)[0]
        board.groups[groupIdx] = group
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

async function queryList(filterBy = { txt: '', price: 0 }) {
  // return httpService.get(STORAGE_KEY, filterBy)

  const boards = await storageService.query(STORAGE_KEY)
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
  switch (type) {
    case 'task':
      const groupIdx = board.groups.findIndex((group) => group.id === groupId)
      const taskIdx = board.groups[groupIdx].tasks.findIndex(
        (task) => task.id === taskId
      )
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
    style: {},
  }
}

async function getEmptyBoard() {
  return {
    title: 'New Board',
    isStarred: false,
    archivedAt: '',
    cmpOrder: ['title', 'date', 'person', 'status', 'text', 'priority'],
    createdBy: {
      _id: '',
      fullname: '',
      imgUrl: '',
    },
    style: {},
    labels: [],
    members: [],
    groups: [getEmptyGroup()],
  }
}

import jsonBoard from '../../data/board.json' assert {type: 'json'}
function _createDemoData() {
  const board = utilService.loadFromStorage(STORAGE_KEY)
  if (!board) {
    utilService.saveToStorage(STORAGE_KEY, jsonBoard)
  }
}
