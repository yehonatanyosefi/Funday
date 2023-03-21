
import { httpService } from './http.service.js'
import { utilService } from './util.service.js'



export const boardService = {
    query,
    getById,
    save,
    remove,
    getEmptyTask,
    addTaskMsg
}
window.cs = boardService


async function query(filterBy = { txt: '', price: 0 }) {
    return httpService.get('task', filterBy)
}
function getById(taskId) {
    return httpService.get(`task/${taskId}`)
}

async function remove(taskId) {
    return httpService.delete(`task/${taskId}`)
}
async function save(task) {
    var savedTask
    if (task._id) {
        savedTask = await httpService.put(`task/${task._id}`, task)

    } else {
        savedTask = await httpService.post('task', task)
    }
    return savedTask
}

async function addTaskMsg(taskId, txt) {
    const savedMsg = await httpService.post(`task/${taskId}/msg`, { txt })
    return savedMsg
}


function getEmptyTask() {
    return {
        vendor: 'Susita-' + (Date.now() % 1000),
        price: utilService.getRandomIntInclusive(1000, 9000),
    }
}





