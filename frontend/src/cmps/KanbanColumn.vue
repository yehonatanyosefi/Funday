<template>
	<div class="kanban-column">
		<div class="header-wrapper" :style="{ backgroundColor: column.colors[idx] }">
			<span v-if="!column.words[idx]">Blank</span>{{ column.words[idx] }} / {{ cardsArr.length }}
		</div>
		<Container
			class="card"
			group-name="cols"
			tag="div"
			orientation="vertical"
			@drop="onGroupDrop($event)"
			dragClass="dragged-element"
		>
			<Draggable class="card-preview" v-for="task in cardsArr" :key="task.id">
				<div class="cmp-preview">{{ task.title }}</div>
				<div class="cmp-preview" v-for="(cmp, idx) in cmpOrder" :key="idx">
					<div class="column-title">{{ cmp }}</div>
					<component
						:is="capitalizeFirstLetter(cmp)"
						:info="task[cmp]"
						:groupColor="task.groupColor"
						@saveTask="saveTask($event, { cmp, task, groupId: task.taskGroupId })"
					></component>
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
		cmpOrder: Array,
		idx: Number,
	},
	created() {},
	data() {
		return {
			modifiedCards: [],
		}
	},
	methods: {
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
		onGroupDrop(dropResult) {
			const { removedIndex, addedIndex, payload } = dropResult
			if (removedIndex === null && addedIndex === null) return
			const cards = [...this.cardsArr]
			const itemToAdd = payload
			if (removedIndex !== null) {
				cards.splice(removedIndex, 1)
			}
			if (addedIndex !== null) {
				cards.splice(addedIndex, 0, itemToAdd)
			}
			this.modifiedCards = cards
			this.updateBoardCards(cards)
		},
		updateBoardCards(updatedCards) {
			const newBoard = JSON.parse(JSON.stringify(this.board))
			updatedCards.forEach((card) => {
				const groupIndex = newBoard.groups.findIndex((group) => group.id === card.taskGroupId)
				const taskIndex = newBoard.groups[groupIndex].tasks.findIndex((task) => task.id === card.id)
				newBoard.groups[groupIndex].tasks.splice(taskIndex, 1, card)
			})
			this.updateBoard(newBoard)
		},
		updateBoard(newBoard) {
			console.log(`newBoard:`, newBoard)
			// Update the board state in Vuex (or use another method to update the board)
			// this.$store.commit('updateBoard', newBoard)
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
			return this.getListCards('status', this.column.words[this.idx]).flat()
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
