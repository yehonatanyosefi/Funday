<template>
	<div class="kanban-wrapper">
		<div class="kanban" v-if="board._id">
			<Container
				v-if="!isMobile"
				tag="div"
				group-name="cols"
				dragClass="dragged-element"
				orientation="horizontal"
				:drop-placeholder="dropPlaceholderOptions"
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
						@setDraggedTask="setDraggedTask"
						@setDraggedColumn="setDraggedColumn"
					/>
				</Draggable>
			</Container>
			<div v-else v-for="(column, idx) in currColumns.words" :key="idx">
				<KanbanColumn
					:filteredCmpOrder="filteredCmpOrder"
					:current="current"
					:column="currColumns"
					:board="board"
					:idx="idx"
					@saveTask="saveTask"
					@setDraggedTask="setDraggedTask"
					@setDraggedColumn="setDraggedColumn"
				/>
			</div>
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
					<label>
						<div>{{ capitalizeFirstLetter(cmpName) }}</div>
						<component
							v-if="capitalizeFirstLetter(cmpName) + 'Svg'"
							:is="capitalizeFirstLetter(cmpName) + 'Svg'"
							width="16px"
							height="16px"
						></component>
					</label>
				</div>
			</div>
		</div>
		<RouterView></RouterView>
	</div>
</template>

<script>
import { Container, Draggable } from 'vue3-smooth-dnd'
import KanbanColumn from './KanbanColumn.vue'
import PersonSvg from '../assets/svg/PersonSvg.svg'
import TimelineSvg from '../assets/svg/TimelineSvg.svg'
import DateSvg from '../assets/svg/Date.svg'
import GroupSvg from '../assets/svg/Group.svg'
import StatusSvg from '../assets/svg/Status.svg'
import PrioritySvg from '../assets/svg/Status.svg'
import TextSvg from '../assets/svg/TextCopy.svg'

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
			dropPlaceholderOptions: {
				className: 'drop-preview',
				animationDuration: '150',
				showOnTop: true,
			},
			draggedTaskPayload: null,
			draggedToColumn: null,
		}
	},
	created() {},
	methods: {
		setDraggedTask({ task, groupId, cmp }) {
			this.draggedTaskPayload = { task, groupId, cmp }
			if (this.draggedToColumn) {
				this.saveDraggedTask()
			}
		},
		setDraggedColumn(column) {
			this.draggedToColumn = column
			if (this.draggedTaskPayload) {
				this.saveDraggedTask()
			}
		},
		saveDraggedTask() {
			const { task, groupId, cmp } = this.draggedTaskPayload
			const taskToSave = { attName: cmp, attValue: this.draggedToColumn, taskId: task.id }
			const payloadToSave = { task: taskToSave, groupId }
			this.saveTask(payloadToSave)
			this.draggedTaskPayload = null
			this.draggedToColumn = null
		},
		changeSelection(ev) {
			this.current = ev.target.value
		},
		onColumnDrop(dropResult) {
			console.log(`dropResult:`, dropResult)
			// const { removedIndex, addedIndex } = dropResult
			// if (removedIndex === null || addedIndex === null || addedIndex === removedIndex) return
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
		async saveTask(payload) {
			try {
				const payloadToSave = { ...payload, boardId: this.board._id }
				const request = {
					dispatch: () => this.$store.dispatch({ type: 'saveTask', payload: payloadToSave }),
				}
				await this.$store.dispatch('enqueueRequest', request)
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
		capitalizeFirstLetter(str) {
			return str.charAt(0).toUpperCase() + str.slice(1)
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
		isMobile() {
			const mobileScreenWidthThreshold = 768
			return window.innerWidth <= mobileScreenWidthThreshold
		},
	},
	components: {
		Container,
		Draggable,
		KanbanColumn,
		PersonSvg,
		TimelineSvg,
		DateSvg,
		GroupSvg,
		StatusSvg,
		TextSvg,
		PrioritySvg
	},
}
</script>
