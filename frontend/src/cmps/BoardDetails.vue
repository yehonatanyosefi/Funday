<template>
<section class="board-details">
	<template v-for="group in groups" :key="group.id">
		<BoardGroup :group="group" :cmpOrder="cmpOrder" @updateTask="updateTask"></BoardGroup>
	</template>
	<!-- <div class="container home">
		<ul class="task-list">
			<li v-for="task in tasks" :key="task._id">
				<p>
					{{ task.vendor }}
				</p>
				<p>${{ task.price?.toLocaleString() }}</p>
				<button @click="removeTask(task._id)">x</button>
				<button @click="updateTask(task)">Update</button>
				<hr />
				<button @click="addTaskMsg(task._id)">Add task msg</button>
				<button @click="printTaskToConsole(task)">Print msgs to console</button>
			</li>
		</ul>
		<hr />
		<form @submit.prevent="addTask()">
			<h2>Add task</h2>
			<input type="text" v-model="taskToAdd.vendor" />
			<button>Save</button>
		</form>
	</div> -->
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
		async updateTask(payload) {
			try {
				const payloadToSave = {...payload,boardId:'b101'}
				await this.$store.dispatch({type:'updateTask',payload:payloadToSave})
				// showSuccessMsg('Task updated')
			} catch (err) {
				console.log(err)
				// showErrorMsg('Cannot update task')
			}
		},
		async addTask() {
			try {
				await this.$store.dispatch({ type: 'addTask', task: this.taskToAdd })
				showSuccessMsg('Task added')
				this.taskToAdd = boardService.getEmptyTask()
			} catch (err) {
				console.log(err)
				showErrorMsg('Cannot add task')
			}
		},
		async removeTask(taskId) {
			try {
				await this.$store.dispatch(getActionRemoveTask(taskId))
				showSuccessMsg('Task removed')
			} catch (err) {
				console.log(err)
				showErrorMsg('Cannot remove task')
			}
		},
		async addTaskMsg(taskId) {
			try {
				await this.$store.dispatch(getActionAddTaskMsg(taskId))
				showSuccessMsg('Task msg added')
			} catch (err) {
				console.log(err)
				showErrorMsg('Cannot add task msg')
			}
		},
		printTaskToConsole(task) {
			console.log('Task msgs:', task.msgs)
		},
	},
	components: {
		BoardHeader,
		BoardGroup,
	},
}
</script>
