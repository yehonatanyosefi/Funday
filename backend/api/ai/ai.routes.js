const express = require('express')
const { requireAuth, requireAdmin } = require('../../middlewares/requireAuth.middleware')
const { log } = require('../../middlewares/logger.middleware')
const {
	getBoardList,
	getBoardById,
	addBoard,
	addGptBoard,
	updateBoard,
	applyDrag,
	removeBoard,
} = require('./board.controller')
const router = express.Router()

// middleware that is specific to this router
// router.use(requireAuth)

router.get('/', log, getBoardList)
router.get('/:id', getBoardById)
router.post('/gpt', requireAuth, addGptBoard)
router.post('/', requireAuth, addBoard)
router.put('/drag', requireAuth, applyDrag)
router.put('/:id', requireAuth, updateBoard)
router.delete('/:id', requireAuth, removeBoard)

module.exports = router
