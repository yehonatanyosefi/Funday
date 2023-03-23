<template>
<section class="board-details">
	<template v-for="group in groups" :key="group.id">
		<BoardGroup
			:group="group"
			:cmpOrder="cmpOrder"
			@saveTask="saveTask"
			@removeTask="removeTask"></BoardGroup>
	</template>
</section>
</template>

<script>
import BoardHeader from './BoardHeader.vue'
import BoardGroup from './BoardGroup.vue'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service'
import { boardService } from '../services/board.service.local'
export default {
	data() {
		return {
			taskToAdd: boardService.getEmptyTask(),
			cmpOrder: ['title', 'date', 'person', 'status', 'text', 'priority'],
		}
	},
	computed: {
		loggedInUser() {
			return this.$store.getters.loggedinUser
		},
		groups() {
        		return this.$store.getters.groups
		},
	},
	created() {
		this.$store.dispatch({ type: "loadGroups" })
	},
	methods: {
		async saveTask(payload) {
			try {
				const payloadToSave = {...payload,boardId:'b101'}
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
	},
}
</script>
