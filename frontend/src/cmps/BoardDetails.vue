<template>
<section class="board-details">
    <Container orientation="vertical" @drop="onDrop">
      <Draggable v-for="group in board.groups" :key="group.id">
		<!-- <template  v-for="group in board.groups" :key="group.id">	 -->
			<BoardGroup
				:group="group"
				:cmpOrder="cmpOrder"
				@saveTask="saveTask"
				@removeTask="removeTask"
				@updateGroup="updateGroup"></BoardGroup>
		<!-- </template> -->
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
		async updateGroup(payload) {
			try {
				const payloadToSave = {...payload,boardId:this.board._id}
				await this.$store.dispatch({type:'saveGroup',payload:payloadToSave})
				// showSuccessMsg('Task updated')
			} catch (err) {
				// showErrorMsg('Cannot update task')
			}
		},
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
