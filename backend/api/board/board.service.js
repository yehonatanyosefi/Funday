const dbService = require('../../services/db.service')
const logger = require('../../services/logger.service')
const utilService = require('../../services/util.service')
const ObjectId = require('mongodb').ObjectId

async function query(filterBy = { txt: '', userId: '' }) {
	try {
		// const criteria = {
		//     title: { $regex: filterBy.txt, $options: 'i' }
		// }

		// const criteria = {
		// 	$and: [
		// 		filterBy.txt ? { title: { $regex: new RegExp(filterBy.txt, 'i') } } : {},
		// 		filterBy.userId ? { members: { $elemMatch: { _id: filterBy.userId } } } : {},
		// 	],
		// }

		// const collection = await dbService.getCollection('board')
		// const boards = await collection.find(criteria).sort({ position: 1 }).toArray()
		// let boardList = boards.map((board) => {
		// 	return { _id: board._id, title: board.title, position: board.position, isStarred: board.isStarred }
		// })
		// return boardList

		const criteria = {
			$and: [
				filterBy.txt ? { title: { $regex: new RegExp(filterBy.txt, 'i') } } : {},
				filterBy.userId ? { members: { $elemMatch: { _id: filterBy.userId } } } : {},
			],
		}

		const projection = {
			$project: {
				_id: 1,
				title: 1,
				position: 1,
				isStarred: 1,
			},
		}

		const collection = await dbService.getCollection('board')
		const boardList = await collection
			.aggregate([{ $match: criteria }, projection])
			.sort({ position: 1 })
			.toArray()

		return boardList


		// let boardsCopy = JSON.parse(JSON.stringify(boards))
		// if (filterBy.txt) {
		// 	const regex = new RegExp(filterBy.txt, 'i')
		// 	boards = boardsCopy.filter((board) => regex.test(board.title))
		// }

		// if (filterBy.userId){
		// 	boards = boardsCopy.filter(board => board.members.some(member => member._id===filterBy.userId))
		// }
		// const boardList = boards.map((board) => {
		// 	return { _id: board._id, title: board.title }
		// })
		// return boardList
	} catch (err) {
		logger.error('cannot find boardList', err)
		throw err
	}
}

async function getById(boardId) {
	try {
		const collection = await dbService.getCollection('board')
		const board = await collection.findOne({ _id: new ObjectId(boardId) })
		return board
	} catch (err) {
		logger.error(`while finding board ${boardId}`, err)
		throw err
	}
}

async function remove(boardId) {
	try {
		const collection = await dbService.getCollection('board')
		await collection.deleteOne({ _id: new ObjectId(boardId) })
		return boardId
	} catch (err) {
		logger.error(`cannot remove board ${boardId}`, err)
		throw err
	}
}

async function add(board) {
	try {
		const collection = await dbService.getCollection('board')
		const isBoard = await collection.find()
		const maxPos = isBoard ? await collection.find().sort({ position: -1 }).limit(1).toArray() : null
		const maxPosition = maxPos ? maxPos[0]?.position : 1
		board.position = !maxPosition ? 1 : maxPosition + 1
		await collection.insertOne(board)
		return board
	} catch (err) {
		logger.error('cannot insert board', err)
		throw err
	}
}

async function applyDrag(ids) {
	try {
		if (ids.addedId === -1 || ids.removedId === -1) return true
		const collection = await dbService.getCollection('board')
		const addedBoard = await collection.findOne({ _id: new ObjectId(ids.addedId) })
		const removedBoard = await collection.findOne({ _id: new ObjectId(ids.removedId) })
		const tempPos = addedBoard.position
		addedBoard.position = removedBoard.position
		removedBoard.position = tempPos
		await update(addedBoard)
		await update(removedBoard)
		return true
	} catch (err) {
		logger.error('cannot apply drag', err)
		throw err
	}
}

// async function update(board) {
//   try {
//     // const boardToSave = {
//     //   title: board.title,
//     //   price: board.price,
//     // }
//     let boardToUpdate = board
//     delete boardToUpdate._id
//     console.log('boardToUpdate',boardToUpdate)
//     const collection = await dbService.getCollection('board')
//     await collection.updateOne(
//       { _id: new ObjectId(board._id) },
//       { $set: boardToUpdate }
//     //   { $set: boardToSave }
//     )
//     return board
//   } catch (err) {
//     logger.error(`cannot update board ${board._id}`, err)
//     throw err
//   }
// }

async function update(board) {
	try {
		let boardToUpdate = { ...board }
		delete boardToUpdate._id

		const collection = await dbService.getCollection('board')
		const filter = { _id: new ObjectId(board._id) }

		await collection.updateOne(filter, { $set: boardToUpdate })

		return board
	} catch (err) {
		logger.error(`cannot update board ${board._id}`, err)
		throw err
	}
}

async function addBoardMsg(boardId, msg) {
	try {
		msg.id = utilService.makeId()
		const collection = await dbService.getCollection('board')
		await collection.updateOne({ _id: new ObjectId(boardId) }, { $push: { msgs: msg } })
		return msg
	} catch (err) {
		logger.error(`cannot add board msg ${boardId}`, err)
		throw err
	}
}

async function removeBoardMsg(boardId, msgId) {
	try {
		const collection = await dbService.getCollection('board')
		await collection.updateOne({ _id: new ObjectId(boardId) }, { $pull: { msgs: { id: msgId } } })
		return msgId
	} catch (err) {
		logger.error(`cannot add board msg ${boardId}`, err)
		throw err
	}
}

require('dotenv').config()
const { Configuration, OpenAIApi } = require("openai")

const configuration = new Configuration({
	apiKey: process.env.OPENAI_API_KEY,
})
const openai = new OpenAIApi(configuration)

async function gpt(boardObj = { boardName: 'Development' }) {
	const boardName = boardObj.boardName
	const completion = await openai.createChatCompletion({
		model: "gpt-3.5-turbo",
		messages: [{
			role: "user", content: `Please provide 15 task names for a Monday board with the name "${boardName}". Each task name should be concise and relevant to the topic. Please organize the tasks into three groups, with the group name listed at the top of each group. Please include only the task names and group names in your response, as I will be parsing them using code. The final format should be as follows:

Group Number: Group Name
<task title here>
<task title here>
<task title here>
<task title here>
<task title here>

Group Number: Group Name
<task title here>
<task title here>
<task title here>
<task title here>
<task title here>

Group Number: Group Name
<task title here>
<task title here>
<task title here>
<task title here>
<task title here>` }],
	})
	const content = completion.data.choices[0].message.content
	const groupsData = arrangeData(content)
	const board = await add(getBoard(boardObj, groupsData))
	return board
}

module.exports = {
	remove,
	query,
	getById,
	add,
	update,
	addBoardMsg,
	removeBoardMsg,
	applyDrag,
	gpt
}

function getRndStatus() {
	const statuses = ['Done', 'Working on it', 'Stuck', '']
	return statuses[getRandomIntInclusive(0, statuses.length - 1)]
}
function getRndPriority() {
	const priorities = ['Critical', 'High', 'Medium', 'Low', '']
	return priorities[getRandomIntInclusive(0, priorities.length - 1)]
}

function getTask(taskData) {
	return {
		id: makeId(),
		title: taskData?.title || 'New Task',
		status: getRndStatus(),
		priority: getRndPriority(),
		text: '',
		comments: [],
		person: [],
		timeline: {
			startDate: Date.now() - getRandomIntInclusive(100000000, 1000000000),
			dueDate: Date.now() + getRandomIntInclusive(100000000, 1000000000),
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

function getGroup(groupData) {
	return {
		id: utilService.makeId(),
		title: groupData?.title || 'New Group',
		isExpanded: true,
		archivedAt: null,
		tasks: [getTask(groupData.task[0]), getTask(groupData.task[1]), getTask(groupData.task[2]), getTask(groupData.task[3]), getTask(groupData.task[4]),],
		style: {
			color: groupData.color || getRndColors()[0],
		},
	}
}

function getRndColors() {
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
	const rndColors = []
	while (rndColors.length < 3) {
		const rndColor = colors[getRandomIntInclusive(0, colors.length - 1)]
		if (!rndColors.includes(rndColor)) rndColors.push(rndColor)
	}
	return rndColors
}

function getBoard(boardObj, groupsData) {
	const { boardName, createdBy, members } = boardObj
	return {
		title: boardName || 'New Board',
		isStarred: false,
		archivedAt: '',
		cmpOrder: ['date', 'person', 'status', 'text', 'priority', 'timeline'],
		createdBy: createdBy || {
			_id: '',
			fullname: '',
			imgUrl: '',
		},
		style: {},
		labels: [],
		members: members || [],
		groups: [getGroup(groupsData[0]), getGroup(groupsData[1]), getGroup(groupsData[2])],
	}
}

function makeId(length = 6) {
	var txt = ''
	var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

	for (var i = 0; i < length; i++) {
		txt += possible.charAt(Math.floor(Math.random() * possible.length))
	}

	return txt
}
function getRandomIntInclusive(min, max) {
	min = Math.ceil(min)
	max = Math.floor(max)
	return Math.floor(Math.random() * (max - min + 1)) + min //The maximum is inclusive and the minimum is inclusive
}
function arrangeData(data) {
	const groups = data.split("\n\n")
	const rndColors = getRndColors()
	const groupsData = groups.map((group, idx) => {
		const lines = group.split("\n")
		const title = lines[0].substring(lines[0].indexOf(idx + 1 + ': ') + 2)
		const tasks = lines.slice(1)

		const taskData = tasks.map((task) => {
			const taskTitle = task.substring(task.indexOf(".") + 2)
			return {
				title: taskTitle,
			}
		})
		return {
			title,
			color: rndColors[idx],
			task: taskData,
		}
	})
	return groupsData
}