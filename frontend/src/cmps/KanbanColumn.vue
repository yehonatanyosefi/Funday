<template>
	<div class="kanban-column">
		<div class="header-wrapper" :style="{ backgroundColor: column.colors[idx] }">
			<span v-if="!column.words[idx]">Blank</span>{{ column.words[idx] }} / {{ cardsArr.length }}
		</div>
		<Container
			class="card"
			group-name="col-items"
			orientation="vertical"
			dragClass="dragged-element"
			:shouldAcceptDrop="shouldAcceptDrop"
			@drop="onCardDrop($event)"
		>
			<!-- :get-child-payload="getCardPayload(idx)" -->
			<!-- :drag-handle-selector="dragHandleSelector" -->
			<Draggable class="card-preview" v-for="task in cardsArr" :key="task.id">
				<div class="cmp-preview">{{ task.title }}</div>
				<div class="cmp-preview" v-for="(cmp, idx) in filteredCmpOrder" :key="idx">
					<div class="card-title">{{ cmp }}</div>
					<div class="card-cmp">
						<component
							:is="capitalizeFirstLetter(cmp)"
							:info="task[cmp]"
							:groupColor="task.groupColor"
							@saveTask="saveTask($event, { cmp, task, groupId: task.taskGroupId })"
						></component>
					</div>
				</div>
			</Draggable>
		</Container>
	</div>
</template>

<script>
import Date from './dynamicCmps/Date.vue'
import Timeline from './dynamicCmps/Timeline.vue'
import Priority from './dynamicCmps/Priority.vue'
import Status from './dynamicCmps/Status.vue'
import Title from './dynamicCmps/Title.vue'
import Text from './dynamicCmps/Text.vue'
import Person from './dynamicCmps/Person.vue'
import { Container, Draggable } from 'vue3-smooth-dnd'
export default {
	emits: ['saveTask'],
	name: 'KanbanColumn',
	props: {
		board: Object,
		column: Object,
		idx: Number,
		current: String,
		filteredCmpOrder: Array,
	},
	created() {},
	data() {
		return {
			modifiedCards: [],
		}
	},
	methods: {
		// isMobile() {
		// 	return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
		// },
		capitalizeFirstLetter(str) {
			return str.charAt(0).toUpperCase() + str.slice(1)
		},
		getListCards(listType = 'status', listValue) {
			const filteredTasks = this.board.groups.map((group) => {
				return group.tasks
					.filter((task) => task[listType] === listValue)
					.map((task) => {
						const taskCopy = { ...task }
						taskCopy.groupColor = group.style.color
						taskCopy.taskGroupId = group.id
						return taskCopy
					})
			})
			return filteredTasks
		},
		saveTask(payload, { cmp, task, groupId }) {
			const taskToSave = JSON.parse(JSON.stringify(task))
			taskToSave[cmp] = payload
			this.$emit('saveTask', { taskToSave, groupId })
		},
		onCardDrop(dropResult) {
			const { removedIndex, addedIndex, payload } = dropResult
			if (removedIndex === null && addedIndex === null) return
			if (removedIndex !== null) {
				console.log(`removedIndex:`, removedIndex)
				this.cardsArr[removedIndex]
			}
			if (addedIndex !== null) {
				console.log(`addedIndex:`, addedIndex)
				this.cardsArr[addedIndex]
			}
			// const cards = [...this.cardsArr]
			// const itemToAdd = payload
			// if (removedIndex !== null) {
			// 	cards.splice(removedIndex, 1)
			// }
			// if (addedIndex !== null) {
			// 	cards.splice(addedIndex, 0, itemToAdd)
			// }
			// this.modifiedCards = cards
			// this.updateBoardCards(cards)
		},
		updateBoardCards(updatedCards) {
			// const newBoard = JSON.parse(JSON.stringify(this.board))
			// updatedCards.forEach((card) => {
			// 	const groupIndex = newBoard.groups.findIndex((group) => group.id === card.taskGroupId)
			// 	const taskIndex = newBoard.groups[groupIndex].tasks.findIndex((task) => task.id === card.id)
			// 	newBoard.groups[groupIndex].tasks.splice(taskIndex, 1, card)
			// })
			// this.updateBoard(newBoard)
		},
		updateBoard(newBoard) {
			console.log(`newBoard:`, newBoard)
			// Update the board state in Vuex (or use another method to update the board)
			// this.$store.commit('updateBoard', newBoard)
		},
		getCardPayload(columnIdx) {
			console.log(`columnIdx:`, columnIdx)
		},
		shouldAcceptDrop(e) {
			return e === 'col-items'
		},
	},
	computed: {
		// cardsArr() {
		// 	return this.getListCards('status', this.column.words[this.idx]).flat()
		// },
		cardsArr() {
			if (this.modifiedCards.length > 0) {
				return this.modifiedCards
			}
			return this.getListCards(this.current, this.column.words[this.idx]).flat()
		},
	},
	components: {
		Container,
		Draggable,
		Date,
		Timeline,
		Priority,
		Status,
		Title,
		Text,
		Person,
	},
}
</script>
