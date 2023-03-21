<template>
	<div class="container home">
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
	</div>
</template>

<script>
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service'
import { boardService } from '../services/board.service.local'
import { getActionRemoveTask, getActionUpdateTask, getActionAddTaskMsg } from '../store/task.store'
export default {
	data() {
		return {
			taskToAdd: boardService.getEmptyTask(),
		}
	},
	computed: {
		loggedInUser() {
			return this.$store.getters.loggedinUser
		},
		tasks() {
			return this.$store.getters.tasks
		},
	},
	created() {
		this.$store.dispatch({ type: 'loadTasks' })
	},
	methods: {
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
		async updateTask(task) {
			try {
				task = { ...task }
				task.price = +prompt('New price?', task.price)
				await this.$store.dispatch(getActionUpdateTask(task))
				showSuccessMsg('Task updated')
			} catch (err) {
				console.log(err)
				showErrorMsg('Cannot update task')
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
}
</script>
