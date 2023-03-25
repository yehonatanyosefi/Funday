<template>
<section class="board-details">
	<div v-if="!board?.groups?.length">No Groups Found</div>
    <Container v-else orientation="vertical" 
        @drop="onGroupDrop($event)">
      <Draggable v-for="group in board.groups" :key="group.id">
			<BoardGroup
				:group="group"
				:cmpOrder="cmpOrder"
				@saveTask="saveTask"
				@removeTask="removeTask"
				@saveGroup="saveGroup"
				@saveGroupTitle="saveGroupTitle"
				@removeGroup="removeGroup"
				@applyTaskDrag="applyTaskDrag"
				@addTask="addTask"></BoardGroup>
      </Draggable>
    </Container>
      <RouterView></RouterView>
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
				ids = {...ids,boardId:this.board._id}
				await this.$store.dispatch({type:'removeTask',ids})
				const groupIdx = this.board.groups.findIndex(group => group.id === ids.groupId)
				if (!this.board.groups[groupIdx].tasks?.length) await this.$store.dispatch({type:'addTask',payload:ids.groupIdx})
				showSuccessMsg('Task removed')
			} catch (err) {
				console.log(err)
				showErrorMsg('Cannot remove task')
			}
		},
		async saveGroupTitle(payload) { //this is the change
			try {
				const payloadToSave = {...payload,boardId:this.board._id}
				await this.$store.dispatch({type:'saveGroupTitle',payload:payloadToSave})
				// showSuccessMsg('Task updated')
			} catch (err) {
				// showErrorMsg('Cannot update task')
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
		async removeGroup(groupId) {
			try {
				const payload = {groupId,boardId:this.board._id}
				await this.$store.dispatch({type:'removeGroup',payload})
				if (!this.board.groups.length)await this.$store.dispatch({type:'addGroup'})
				showSuccessMsg('Group removed')
			} catch (err) {
				showErrorMsg('Cannot remove group')
			}
		},
		async addTask(groupId) {
			try {
				await this.$store.dispatch({type:'addTask',groupId})
			} catch (err) {
				showErrorMsg('Cannot add task')
			}
		},
		onGroupDrop(dropPayload) {
			const {removedIndex, addedIndex} = dropPayload
			if (removedIndex === null && addedIndex === null) return
			const removedId = this.board.groups.find((group,idx) => idx === removedIndex).id
			const addedId = this.board.groups.find((group,idx) => idx === addedIndex).id
			const payload = {removedId, addedId,boardId:this.board._id}
			this.$store.dispatch({type:'applyGroupDrag',payload})
		},
		applyTaskDrag(groupPayload) {
			const payload = {...groupPayload,boardId:this.board._id}
			this.$store.dispatch({type:'applyTaskDrag',payload})
		},
	},
	components: {
		BoardHeader,
		BoardGroup,
		Container,
		Draggable,
	},
}
</script>
