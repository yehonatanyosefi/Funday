<template>
	<div class="kanban" v-if="board._id">
		<Container
			group-name="cols"
			tag="div"
			dragClass="dragged-element"
			orientation="horizontal"
			@drop="onGroupDrop($event)"
		>
			<Draggable v-for="(column, idx) in currColumns.words" :key="idx">
				<KanbanColumn
					:column="currColumns"
					:board="board"
					:cmpOrder="cmpOrder"
					:idx="idx"
					@saveTask="saveTask"
				/>
			</Draggable>
		</Container>
	</div>
</template>

<script>
import { Container, Draggable } from 'vue3-smooth-dnd'
import KanbanColumn from './KanbanColumn.vue'
export default {
	data() {
		return {
			columnList: {
				status: {
					words: ['Done', 'Working on it', 'Stuck', ''],
					colors: ['#00c875', '#fdab3d', '#e2445c', '#c4c4c4'],
				},
				priority: {
					words: ['Critical', 'High', 'Medium', 'Low', ''],
					colors: ['#333333', '#401694', '#5559df', '#579bfc', '#c4c4c4'],
				},
			},
			modifiedCards: [],
		}
	},
	created() {},
	methods: {
		getgroupHeightPx() {
			// 	let kanban = document.getElementById('kanbanContainer')
			// 	return kanban ? kanban.offsetHeight - 122 : 0
		},
		onGroupDrop(dropResult) {
			const { removedIndex, addedIndex } = dropResult
			if (removedIndex === null || addedIndex === null) return
			const newWords = [...this.currColumns.words]
			const newColors = [...this.currColumns.colors]
			newWords.splice(addedIndex, 0, ...newWords.splice(removedIndex, 1))
			newColors.splice(addedIndex, 0, ...newColors.splice(removedIndex, 1))
			this.updateColumns({ words: newWords, colors: newColors })
		},
		updateColumns(newColumns) {
			this.columnList.status.words = newColumns.words
			this.columnList.status.colors = newColumns.colors
		},
		async saveTask({ taskToSave, groupId }) {
			try {
				const payloadToSave = { task: taskToSave, groupId, boardId: this.board._id }
				await this.$store.dispatch({ type: 'saveTask', payload: payloadToSave })
				// showSuccessMsg('Task updated')
			} catch (err) {
				console.log(err)
				// showErrorMsg('Cannot update task')
			}
		},
	},
	computed: {
		board() {
			return this.$store.getters.filteredBoard
		},
		cmpOrder() {
			return this.board.cmpOrder
		},
		currColumns() {
			const current = 'status'
			return this.columnList[current]
		},
	},
	components: { Container, Draggable, KanbanColumn },
}
</script>
