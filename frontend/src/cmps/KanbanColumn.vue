<template>
	<div class="kanban-column">
		<div class="header-wrapper" :style="{ backgroundColor: column.colors[idx] }">
			<span v-if="!column.words[idx]">Blank</span><span v-else>{{ column.words[idx] }}</span
			><span class="slash">/</span><span>{{ cardsArr.length }}</span>
		</div>
		<Container
			v-if="!isMobile"
			class="card"
			group-name="col-items"
			orientation="vertical"
			dragClass="dragged-element"
			@drop="onCardDrop($event)"
			:drop-placeholder="dropPlaceholderOptions"
		>
			<!-- :should-accept-drop="shouldAcceptDrop" -->
			<Draggable class="card-preview" v-for="task in cardsArr" :key="task.id">
				<div class="cmp-title">
					<div class="card-title-container">{{ task.title }}</div>
					<div class="cmp-buttons">
						<div>
							<RouterLink :to="'/board/' + board._id + '/kanban/task-kanban/' + task.id">
								<Update v-if="task.comments?.length" class="svg-icon update" width="24" height="24" />
								<div v-if="task.comments?.length" class="update-num">{{ task.comments.length }}</div>
								<AddUpdate v-else class="svg-icon add-update" width="24" height="24" />
							</RouterLink>
						</div>
						<Menu class="svg-icon menu-btn" width="20" height="20" />
					</div>
				</div>
				<div class="cmp-preview" v-for="(cmp, idx) in filteredCmpOrder" :key="idx">
					<div class="card-title">
						<component
							v-if="capitalizeFirstLetter(cmp) + 'Svg'"
							:is="capitalizeFirstLetter(cmp) + 'Svg'"
							width="16px"
							height="16px"
						></component>
						{{ capitalizeFirstLetter(cmp) }}
					</div>
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
		<div v-else class="card">
			<div v-for="task in cardsArr" :key="task.id" class="card-preview">
				<div class="cmp-title">
					<div class="card-title-container">
						<div class="elipsis">
							{{ task.title }}
						</div>
					</div>
					<div class="cmp-buttons">
						<div>
							<RouterLink :to="'/board/' + board._id + '/kanban/task-kanban/' + task.id">
								<Update v-if="task.comments?.length" class="svg-icon update" width="24" height="24" />
								<div v-if="task.comments?.length" class="update-num">{{ task.comments.length }}</div>
								<AddUpdate v-else class="svg-icon add-update" width="24" height="24" />
							</RouterLink>
						</div>
						<Menu class="svg-icon menu-btn" width="20" height="20" />
					</div>
				</div>
				<div class="cmp-preview" v-for="(cmp, idx) in filteredCmpOrder" :key="idx">
					<div class="card-title">
						<component
							v-if="capitalizeFirstLetter(cmp) + 'Svg'"
							:is="capitalizeFirstLetter(cmp) + 'Svg'"
							width="16px"
							height="16px"
						></component>
						{{ capitalizeFirstLetter(cmp) }}
					</div>
					<div class="card-cmp">
						<component
							:is="capitalizeFirstLetter(cmp)"
							:info="task[cmp]"
							:groupColor="task.groupColor"
							@saveTask="saveTask($event, { cmp, task, groupId: task.taskGroupId })"
						></component>
					</div>
				</div>
			</div>
		</div>
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
import Menu from '../assets/svg/Menu.svg'
import PersonSvg from '../assets/svg/PersonSvg.svg'
import TimelineSvg from '../assets/svg/TimelineSvg.svg'
import DateSvg from '../assets/svg/Date.svg'
import GroupSvg from '../assets/svg/Group.svg'
import StatusSvg from '../assets/svg/Status.svg'
import TextSvg from '../assets/svg/Text.svg'
import Update from '../assets/svg/Update.svg'
import AddUpdate from '../assets/svg/AddUpdate.svg'
import { Container, Draggable } from 'vue3-smooth-dnd'
export default {
	emits: ['saveTask', 'setDraggedTask', 'setDraggedColumn'],
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
			dropPlaceholderOptions: {
				className: 'drop-preview',
				animationDuration: '150',
				showOnTop: true,
			},
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
			const taskToSave = { attName: cmp, attValue: payload, taskId: task.id }
			const payloadToSave = { task: taskToSave, groupId }
			this.$emit('saveTask', payloadToSave)
		},
		onCardDrop(dropResult) {
			const { removedIndex, addedIndex } = dropResult
			if ((removedIndex === null && addedIndex === null) || addedIndex === removedIndex) return
			let task = removedIndex !== null ? this.cardsArr[removedIndex] : null
			if (task?.id) {
				const payload = { task, groupId: task.taskGroupId, cmp: this.current }
				this.$emit('setDraggedTask', payload)
			} else {
				let toColumn = this.column.words[this.idx]
				this.$emit('setDraggedColumn', toColumn)
			}
			// this.saveTask(payload, { cmp:this.current, task, groupId })
		},
		shouldAcceptDrop(e) {
			//needed to check if the drop is on the right column
			return e === 'col-items'
		},
	},
	computed: {
		cardsArr() {
			if (this.modifiedCards.length > 0) {
				return this.modifiedCards
			}
			return this.getListCards(this.current, this.column.words[this.idx]).flat()
		},
		isMobile() {
			const mobileScreenWidthThreshold = 768
			return window.innerWidth <= mobileScreenWidthThreshold
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
		Menu,
		PersonSvg,
		TimelineSvg,
		Update,
		AddUpdate,
		DateSvg,
		GroupSvg,
		StatusSvg,
		TextSvg,
	},
}
</script>
