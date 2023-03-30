const dbService = require('../../services/db.service')
const logger = require('../../services/logger.service')
const utilService = require('../../services/util.service')
const ObjectId = require('mongodb').ObjectId

async function query(filterBy = { txt: '', userId: '' }) {
  try {
    // const criteria = {
    //     title: { $regex: filterBy.txt, $options: 'i' }
    // }
    const criteria = {
      $and: [
        filterBy.txt
          ? { title: { $regex: new RegExp(filterBy.txt, 'i') } }
          : {},
        filterBy.userId ? { members: { $elemMatch: { _id: filterBy.userId }, }, } : {},
      ],
    }

    const collection = await dbService.getCollection('board')
    var boardList = await collection.find(criteria).sort({ position: 1 }).toArray()
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
    const board = collection.findOne({ _id: new ObjectId(boardId) })
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

async function add(board) { //db.collection.find().sort({age:-1}).limit(1)
  try {
    const collection = await dbService.getCollection('board')
    const isBoard = await collection.find()
    const maxPos = (isBoard) ? await collection.find().sort({ 'position': -1 }).limit(1).toArray() : null
    const maxPosition = (maxPos) ? maxPos[0]?.position : 1
    board.position = (!maxPosition) ? 1 : maxPosition + 1
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
    console.log(`addedBoard.position:`, addedBoard.position)
    removedBoard.position = tempPos
    console.log(`removedBoard.position:`, removedBoard.position)
    await collection.updateOne(
      { _id: new ObjectId(ids.addedId) },
      { $set: { addedBoard } }
    )
    await collection.updateOne(
      { _id: new ObjectId(ids.removedId) },
      { $set: { removedBoard } }
    )
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
    let boardToUpdate = { ...board };
    delete boardToUpdate._id;

    const collection = await dbService.getCollection('board');
    const filter = { _id: new ObjectId(board._id) };

    await collection.updateOne(filter, { $set: boardToUpdate });

    return board;
  } catch (err) {
    logger.error(`cannot update board ${board._id}`, err);
    throw err;
  }
}

async function addBoardMsg(boardId, msg) {
  try {
    msg.id = utilService.makeId()
    const collection = await dbService.getCollection('board')
    await collection.updateOne(
      { _id: new ObjectId(boardId) },
      { $push: { msgs: msg } }
    )
    return msg
  } catch (err) {
    logger.error(`cannot add board msg ${boardId}`, err)
    throw err
  }
}

async function removeBoardMsg(boardId, msgId) {
  try {
    const collection = await dbService.getCollection('board')
    await collection.updateOne(
      { _id: new ObjectId(boardId) },
      { $pull: { msgs: { id: msgId } } }
    )
    return msgId
  } catch (err) {
    logger.error(`cannot add board msg ${boardId}`, err)
    throw err
  }
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
}
