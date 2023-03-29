<template>
	<section class="board-details">
		<div v-if="!board?.groups?.length">No Groups Found</div>
		<Container
			v-else
			orientation="vertical"
			:drop-placeholder="dropPlaceholderOptions"
			@drop="onGroupDrop($event)"
		>
			<Draggable v-for="group in board.groups" :key="group.id">
				<BoardGroup
					:group="group"
					:cmpOrder="cmpOrder"
					:selectedTasks="selectedTasks[group.id]"
					@saveTask="saveTask"
					@toggleSelectTask="toggleSelectTask"
					@saveGroup="saveGroup"
					@saveGroupAtt="saveGroupAtt"
					@removeGroup="removeGroup"
					@applyTaskDrag="applyTaskDrag"
					@removeTask="removeTask"
					@addTask="addTask"
					@selectGroupTasks="selectGroupTasks"
				></BoardGroup>
				<!-- :selectedTaskArr="selectedTasks[group.id]" -->
			</Draggable>
		</Container>
		<button @click="addGroup" class="add-group-btn">
			<Plus class="add-new-group-plus"></Plus> Add new group
		</button>
		<ActionsModal
			v-if="isActionsModalOpen"
			@closeActionsModal="closeActionsModal"
			@openRemoveModal="openRemoveModal"
			:selectedTasks="selectedTasks"
		></ActionsModal>
		<RemoveModal v-if="isRemoveModalOpen" @closeModal="closeRemoveModal" @remove="handleRemoveTasks"
			>Task<span v-if="Object.values(selectedTasks).length > 1">s</span></RemoveModal
		>
		<RouterView></RouterView>
	</section>
</template>

<script>
import { Container, Draggable } from 'vue3-smooth-dnd'
import BoardHeader from './BoardHeader.vue'
import BoardGroup from './BoardGroup.vue'
import Plus from '../assets/svg/plus.svg'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service'
import { boardService } from '../services/board.service.local'
import ActionsModal from './util/ActionsModal.vue'
import RemoveModal from './util/RemoveModal.vue'
export default {
	data() {
		return {
			taskToAdd: boardService.getEmptyTask(),
			selectedTasks: {},
			isRemoveModalOpen: false,
			isActionsModalOpen: false,
			dropPlaceholderOptions: {
				className: 'drop-preview',
				animationDuration: '150',
				showOnTop: true,
			},
		}
	},
	computed: {
		loggedinUser() {
			return this.$store.getters.loggedinUser
		},
		board() {
			return this.$store.getters.filteredBoard
		},
		cmpOrder() {
			return this.board.cmpOrder
		},
		isSelectedEmpty() {
			return !Object.values(this.selectedTasks).flat().length
		},
	},
	created() {},
	methods: {
		selectGroupTasks(groupId) {
			const group = this.board.groups.find((group) => group.id === groupId)
			const groupSelectedCount = this.selectedTasks[groupId]?.length
			if (!groupSelectedCount) this.selectedTasks[groupId] = []
			if (groupSelectedCount >= group.tasks?.length) {
				this.selectedTasks[groupId] = []
				if (this.isSelectedEmpty) this.isActionsModalOpen = false
				return
			}
			const selectedGroup = this.selectedTasks[groupId]
			group.tasks.forEach((task) => {
				this.selectTask(task.id, groupId, group, selectedGroup)
			})
			this.isActionsModalOpen = true
		},
		selectTask(taskId, groupId, group, selectedGroup) {
			const idx = selectedGroup?.findIndex((selectedTask) => selectedTask.taskId === taskId)
			if (idx === -1) {
				const minifiedTask = { taskId, groupId, groupColor: group.style.color }
				if (!this.selectedTasks[groupId].length) this.selectedTasks[groupId] = [minifiedTask]
				else this.selectedTasks[groupId].push(minifiedTask)
			}
		},
		toggleSelectTask({ taskId, groupId, groupColor }) {
			const task = { taskId, groupId, groupColor }
			const selectedGroup = this.selectedTasks[groupId]
			if (!selectedGroup) this.selectedTasks[groupId] = []
			const idx = this.selectedTasks[groupId]?.findIndex((task) => task.taskId === taskId)
			if (idx > -1) {
				this.selectedTasks[groupId].splice(idx, 1)
				if (this.isSelectedEmpty) this.isActionsModalOpen = false
				return
			}
			if (!this.selectedTasks[groupId].length) this.selectedTasks[groupId] = [task]
			else this.selectedTasks[groupId].push(task)
			this.isActionsModalOpen = true
		},
		async saveTask(payload) {
			try {
				const payloadToSave = { ...payload, boardId: this.board._id }
				await this.$store.dispatch({ type: 'saveTask', payload: payloadToSave })
				// showSuccessMsg('Task updated')
			} catch (err) {
				console.log(err)
				// showErrorMsg('Cannot update task')
			}
		},
		closeActionsModal() {
			this.isActionsModalOpen = false
			this.selectedTasks = {}
		},
		closeRemoveModal() {
			this.isRemoveModalOpen = false
		},
		openRemoveModal() {
			this.isRemoveModalOpen = true
		},
		async handleRemoveTasks() {
			this.isActionsModalOpen = false
			this.isRemoveModalOpen = false
			const ids = {
				tasksToRemove: JSON.parse(JSON.stringify(this.selectedTasks)),
				boardId: this.board._id,
			}
			await this.$store.dispatch({ type: 'removeTasks', ids })
			this.selectedTasks = {}
		},
		async removeTask(ids) {
			try {
				ids = { ...ids, boardId: this.board._id }
				await this.$store.dispatch({ type: 'removeTask', ids })
				const groupIdx = this.board.groups.findIndex((group) => group.id === ids.groupId)
				if (!this.board.groups[groupIdx].tasks?.length)
					await this.$store.dispatch({ type: 'addTask', payload: ids.groupIdx })
				showSuccessMsg('Task removed')
				return true
			} catch (err) {
				console.log(err)
				showErrorMsg('Cannot remove task')
			}
		},
		async saveGroupAtt(payload) {
			try {
				const payloadToSave = { ...payload, boardId: this.board._id }
				await this.$store.dispatch({ type: 'saveGroupAtt', payload: payloadToSave })
				// showSuccessMsg('Task updated')
			} catch (err) {
				// showErrorMsg('Cannot update task')
			}
		},
		async saveGroup(payload) {
			try {
				const payloadToSave = { ...payload, boardId: this.board._id }
				await this.$store.dispatch({ type: 'saveGroup', payload: payloadToSave })
				// showSuccessMsg('Task updated')
			} catch (err) {
				// showErrorMsg('Cannot update task')
			}
		},
		async removeGroup(groupId) {
			try {
				const payload = { groupId, boardId: this.board._id }
				await this.$store.dispatch({ type: 'removeGroup', payload })
				if (!this.board.groups.length) await this.$store.dispatch({ type: 'addGroup' })
				showSuccessMsg('Group removed')
			} catch (err) {
				showErrorMsg('Cannot remove group')
			}
		},
		async addTask(payload) {
			try {
				await this.$store.dispatch({ type: 'addTask', payload })
			} catch (err) {
				showErrorMsg('Cannot add task')
			}
		},
		onGroupDrop(dropPayload) {
			const removedIndex = dropPayload.removedIndex || null
			const addedIndex = dropPayload.addedIndex || null
			if (!removedIndex || !addedIndex) return
			const removedId = this.board.groups.find((group, idx) => idx === removedIndex).id
			const addedId = this.board.groups.find((group, idx) => idx === addedIndex).id
			const payload = { removedId, addedId, boardId: this.board._id }
			this.$store.dispatch({ type: 'applyGroupDrag', payload })
		},
		applyTaskDrag(groupPayload) {
			const payload = { ...groupPayload, boardId: this.board._id }
			this.$store.dispatch({ type: 'applyTaskDrag', payload })
		},
		addGroup() {
			this.$store.dispatch({ type: 'addGroup' })
		},
	},
	components: {
		BoardHeader,
		BoardGroup,
		Container,
		Draggable,
		Plus,
		ActionsModal,
		RemoveModal,
	},
}
</script>
