<template>
<section class="board-details">
    <Container orientation="vertical" @drop="onDrop">
      <Draggable v-for="group in board.groups" :key="group.id">
			<BoardGroup
				:group="group"
				:cmpOrder="cmpOrder"
				@saveTask="saveTask"
				@removeTask="removeTask"
				@saveGroup="saveGroup"
				@removeGroup="removeGroup"></BoardGroup>
      </Draggable>
    </Container>
</section>
</template>

<script>
import { Container, Draggable } from 'vue3-smooth-dnd'
import BoardHeader from './BoardHeader.vue'
import BoardGroup from './BoardGroup.vue'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service'
import { boardService } from '../services/board.service.local'
export default {
	data() {
		return {
			taskToAdd: boardService.getEmptyTask(),
		}
	},
	computed: {
		loggedinUser() {
			return this.$store.getters.loggedinUser
		},
		board() {
        		return this.$store.getters.board
		},
		cmpOrder() {
			return this.board.cmpOrder
		},
	},
	created() {
	},
	methods: {
		async saveTask(payload) {
			try {
				const payloadToSave = {...payload,boardId:this.board._id}
				await this.$store.dispatch({type:'saveTask',payload:payloadToSave})
				// showSuccessMsg('Task updated')
			} catch (err) {
				console.log(err)
				// showErrorMsg('Cannot update task')
			}
		},
		async removeTask(ids) {
			try {
				ids = {...ids,boardId:'b101'}
				await this.$store.dispatch({type:'removeTask',ids})
				showSuccessMsg('Task removed')
			} catch (err) {
				console.log(err)
				showErrorMsg('Cannot remove task')
			}
		},
		async saveGroup(payload) {
			try {
				const payloadToSave = {...payload,boardId:this.board._id}
				await this.$store.dispatch({type:'saveGroup',payload:payloadToSave})
				// showSuccessMsg('Task updated')
			} catch (err) {
				// showErrorMsg('Cannot update task')
			}
		},
		// async saveGroup(context, {payload}) {
		// 	try {
		// 	const {boardId, group, groupId} = payload
		// 	const updatedBoard = await boardService.save(
		// 		boardId,
		// 		'group',
		// 		group,
		// 		groupId
		// 	)
		// 	context.commit({type: 'setBoard', board: updatedBoard})
		// 	return task
		// 	} catch (err) {
		// 	console.log('Store: Error in updateTask', err)
		// 	throw err
		// 	}
		// },
		removeGroup(groupId) {
			try {
				const payload = {groupId,boardId:'b101'}
				this.$store.dispatch({type:'removeGroup',payload})
				showSuccessMsg('Group removed')
			} catch (err) {
				showErrorMsg('Cannot remove group')
			}
		},
		// async removeGroup(context, { payload }) {
		//     try {
		//         const { groupId, boardId } = payload
		//         await boardService.remove(boardId, 'groups', groupId)
		//         context.commit({type:"deleteBoard",boardId})
		//         context.dispatch({type:"loadBoardList"})
		//     } catch (err) {
		//         console.log('boardStore: Error in deleteBoard', err)
		//         throw err
		//     }
		// },
		// service:
		// 'group':
		//     const groupIdx = board.groups.findIndex((group) => group.id === groupId)
		//   board.groups.splice(groupIdx, 1)
		//   return await saveBoard(board)
		onDrop(ev) {
			console.log(`ev:`,ev)
		},
		// async addTask() {
		// 	try {
		// 		await this.$store.dispatch({ type: 'addTask', task: this.taskToAdd })
		// 		showSuccessMsg('Task added')
		// 		this.taskToAdd = boardService.getEmptyTask()
		// 	} catch (err) {
		// 		console.log(err)
		// 		showErrorMsg('Cannot add task')
		// 	}
		// },
	},
	components: {
		BoardHeader,
		BoardGroup,
		Container,
		Draggable,
	},
}
</script>
