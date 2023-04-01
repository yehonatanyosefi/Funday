<template>
	<div class="kanban-wrapper">
		<div class="kanban" v-if="board._id">
			<Container
				group-name="cols"
				tag="div"
				dragClass="dragged-element"
				orientation="horizontal"
				@drop="onColumnDrop($event)"
			>
				<Draggable v-for="(column, idx) in currColumns.words" :key="idx">
					<KanbanColumn
						:filteredCmpOrder="filteredCmpOrder"
						:current="current"
						:column="currColumns"
						:board="board"
						:idx="idx"
						@saveTask="saveTask"
					/>
				</Draggable>
			</Container>
		</div>
		<div class="kanban-options">
			<div class="custom-view">Customize View</div>
			<div class="kanban-col">Kanban Column</div>
			<div class="select-container">
				<select @input="changeSelection">
					<option value="status">Status</option>
					<option value="priority">Priority</option>
				</select>
			</div>
			<div class="card-cols">Card Columns</div>
			<div class="cmp-list">
				<div class="cmp" v-for="(cmpName, idx) in cmpOrder" :key="idx">
					<input
						class="checkbox"
						type="checkbox"
						:checked="filteredCmpOrder.includes(cmpName)"
						@click="toggleFilter(cmpName)"
					/>
					<!-- :checked="filteredCmpOrder[cmpName]" -->
					<label>{{ cmpName }}</label>
					<!-- @change="cmpFilter[cmpName] = !cmpFilter[cmpName]" -->
				</div>

			</div>
		</div>
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
			current: 'status',
			filteredCmpOrder: ['person', 'timeline'],
			modifiedCards: [],
		}
	},
	created() {},
	methods: {
		changeSelection(ev) {
			this.current = ev.target.value
		},
		getGroupHeightPx() {
			// 	let kanban = document.getElementById('kanbanContainer')
			// 	return kanban ? kanban.offsetHeight - 122 : 0
		},
		onColumnDrop(dropResult) {
			console.log(`dropResult:`, dropResult)
			// const { removedIndex, addedIndex } = dropResult
			// if (removedIndex === null || addedIndex === null) return
			// const newWords = [...this.currColumns.words]
			// const newColors = [...this.currColumns.colors]
			// newWords.splice(addedIndex, 0, ...newWords.splice(removedIndex, 1))
			// newColors.splice(addedIndex, 0, ...newColors.splice(removedIndex, 1))
			// this.updateColumns({ words: newWords, colors: newColors })
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
		toggleFilter(cmpName) {
			this.filteredCmpOrder.includes(cmpName)
				? (this.filteredCmpOrder = this.filteredCmpOrder.filter((name) => name !== cmpName))
				: this.filteredCmpOrder.push(cmpName)
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
			return this.columnList[this.current]
		},
	},
	components: { Container, Draggable, KanbanColumn },
}
</script>
