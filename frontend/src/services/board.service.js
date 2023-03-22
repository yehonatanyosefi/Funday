// import { storageService } from './async-storage.service.js'
import { httpService } from './http.service.js'
import { utilService } from './util.service.js'
import { userService } from './user.service.js'

const STORAGE_KEY_TASK = 'task'
const STORAGE_KEY_GROUP = 'group'
const STORAGE_KEY_BOARD = 'broad'

export const boardService = {
  queryTask,
  getTaskById,
  saveTask,
  removeTask,
  getEmptyTask,
  addTaskMsg,
  queryGroup,
  getGroupById,
  saveGroup,
  removeGroup,
  getEmptyGroup,
  addGroupMsg,
  queryBoard,
  getBoardById,
  saveBoard,
  removeBoard,
  getEmptyBoard,
}
window.cs = boardService

// async function saveTask(boardId, groupId, task, activity) {
//     const board = getById(boardId)
//     // PUT /api/board/b123/task/t678

//     // TODO: find the task, and update
//     board.activities.unshift(activity)
//     saveBoard(board)
//     // return board
//     // return task
// }
async function saveTask(task) {
  var savedTask
  if (task._id) {
    savedTask = await storageService.put(STORAGE_KEY_TASK, task)
    // savedTask = await httpService.put(`task/${task._id}`, task)
  } else {
    // Later, owner is set by the backend
    task.owner = userService.getLoggedinUser()
    savedTask = await storageService.post(STORAGE_KEY_TASK, task)
    // savedTask = await httpService.post('task', task)
  }
  return savedTask
}

async function queryTask(filterBy = { txt: '', price: 0 }) {
  // return httpService.get(STORAGE_KEY_TASK, filterBy)

  var tasks = await storageService.query(STORAGE_KEY_TASK)
  if (filterBy.txt) {
    const regex = new RegExp(filterBy.txt, 'i')
    tasks = tasks.filter(
      (task) => regex.test(task.vendor) || regex.test(task.description)
    )
  }
  if (filterBy.price) {
    tasks = tasks.filter((task) => task.price <= filterBy.price)
  }
  return tasks
}
function getTaskById(taskId) {
  return storageService.get(STORAGE_KEY_TASK, taskId)
  // return httpService.get(`task/${taskId}`)
}

async function removeTask(taskId) {
  return await storageService.remove(STORAGE_KEY_TASK, taskId)
  // return httpService.delete(`task/${taskId}`)
}

async function addTaskMsg(taskId, txt) {
  const savedMsg = await httpService.post(`task/${taskId}/msg`, { txt })
  return savedMsg
}

function getEmptyTask() {
  return {
    id: '',
    title: '',
    status: '',
    priority: '',
    text: '',
    comments: [],
    memberIds: [],
    dueDate: null,
    startDate: Date.now(),
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
// async function saveGroup(boardId, groupId, group, activity) {
//     const board = getById(boardId)
//     // PUT /api/board/b123/group/t678

//     // TODO: find the group, and update
//     board.activities.unshift(activity)
//     saveBoard(board)
//     // return board
//     // return group
// }

async function saveGroup(group) {
  var savedGroup
  if (group._id) {
    savedGroup = await storageService.put(STORAGE_KEY_GROUP, group)
    // savedGroup = await httpService.put(`group/${group._id}`, group)
  } else {
    // Later, owner is set by the backend
    group.owner = userService.getLoggedinUser()
    savedGroup = await storageService.post(STORAGE_KEY_GROUP, group)
    // savedGroup = await httpService.post('group', group)
  }
  return savedGroup
}

async function queryGroup(filterBy = { txt: '', price: 0 }) {
  // return httpService.get(STORAGE_KEY_GROUP, filterBy)

  var groups = await storageService.query(STORAGE_KEY_GROUP_GROUP)
  if (filterBy.txt) {
    const regex = new RegExp(filterBy.txt, 'i')
    groups = groups.filter(
      (group) => regex.test(group.vendor) || regex.test(group.description)
    )
  }
  if (filterBy.price) {
    groups = groups.filter((group) => group.price <= filterBy.price)
  }
  return groups
}
function getGroupById(groupId) {
  return storageService.get(STORAGE_KEY_GROUP, groupId)
  // return httpService.get(`group/${groupId}`)
}

async function removeGroup(groupId) {
  await storageService.remove(STORAGE_KEY_GROUP, groupId)
  // return httpService.delete(`group/${groupId}`)
}

async function addGroupMsg(groupId, txt) {
  const savedMsg = await httpService.post(`group/${groupId}/msg`, { txt })
  return savedMsg
}

function getEmptyGroup() {
  return {
    id: 'g101',
    title: 'Frontend',
    archivedAt: null,
    tasks: [],
    style: {},
  }
}

async function queryBoard(filterBy = { title: '' }) {
  // return httpService.get(STORAGE_KEY_BOARD, filterBy)

  var boards = await storageService.query(STORAGE_KEY_BOARD)
  if (filterBy.title) {
    const regex = new RegExp(filterBy.txt, 'i')
    boards = boards.filter((board) => regex.test(board.title))
  }
  // if (filterBy.price) {
  //     boards = boards.filter(board => board.price <= filterBy.price)
  // }
  return boards
}

async function getBoardById(boardId) {
  return storageService.get(STORAGE_KEY_BOARD, boardId)
}
async function saveBoard(board) {
    var savedBoard
  if (board._id) {
    savedBoard = await storageService.put(STORAGE_KEY_BOARD, board)
    // savedBoard = await httpService.put(`board/${board._id}`, board)
  } else {
    // Later, owner is set by the backend
    const user = userService.getLoggedinUser()
    const {_id,fullname,imgUrl}=user
    board.createdBy._id=_id
    board.createdBy.fullname=fullname
    board.createdBy.imgUrl=imgUrl
    savedBoard = await storageService.post(STORAGE_KEY_BOARD, board)
    // savedBoard = await httpService.post('board', board)
  }
  return savedBoard
}
async function removeBoard(boardId) {
  return await storageService.remove(STORAGE_KEY_BOARD, boardId)

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
    groups: [],
  }
}

