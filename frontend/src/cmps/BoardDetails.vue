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
					@saveTask="saveTask"
					@removeTask="removeTask"
					@saveGroup="saveGroup"
					@saveGroupAtt="saveGroupAtt"
					@removeGroup="removeGroup"
					@applyTaskDrag="applyTaskDrag"
					@addTask="addTask"
				></BoardGroup>
			</Draggable>
		</Container>
		<button @click="addGroup" class="add-group-btn">
			<Plus class="add-new-group-plus"></Plus> Add new group
		</button>
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
export default {
	data() {
		return {
			taskToAdd: boardService.getEmptyTask(),
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
	},
	created() {},
	methods: {
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
		async removeTask(ids) {
			try {
				ids = { ...ids, boardId: this.board._id }
				await this.$store.dispatch({ type: 'removeTask', ids })
				const groupIdx = this.board.groups.findIndex((group) => group.id === ids.groupId)
				if (!this.board.groups[groupIdx].tasks?.length)
					await this.$store.dispatch({ type: 'addTask', payload: ids.groupIdx })
				showSuccessMsg('Task removed')
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
	},
}
</script>
