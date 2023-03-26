<template>
	<section class="board-group">
		<h4 class="group-header">
			<div class="menu-btn-container">
				<Menu class="svg-icon menu-btn" width="20" height="20" @click="toggleMenuModal" />
			</div>
			<input type="text" :style="{ color: groupColor }" v-model="groupTitle" @input="saveGroupTitle" />
			<div class="task-count">{{group.tasks.length}} tasks</div>
		</h4>
		<div class="task-header">
			<div class="group-preview-color" :style="{ backgroundColor: groupColor }"></div>
			<section>
				<input
					type="checkbox"
					title="Delete Task"
					class="task-checkbox"
					v-model="isModalOpen"
					@click="openModal"
				/>
			</section>
			<section><div class="task">Task</div></section>
			<section v-for="(cmp, idx) in cmpOrder" :key="idx">
				<div class="task">{{ capitalizeFirstLetter(cmp) }}</div>
			</section>
		</div>

		<Container
			orientation="vertical"
			class="group"
			@drop="onTaskDrop($event)"
			:drop-placeholder="dropPlaceholderOptions"
			:get-child-payload="getCardPayload('task.id')"
		>
			<Draggable v-for="(task, idx) in group.tasks" :key="task.id">
				<TaskPreview
					:task="task"
					:groupColor="group.style.color"
					:cmpOrder="cmpOrder"
					@saveTask="$emit('saveTask', { task: $event, groupId: group.id })"
					@removeTask="$emit('removeTask', { taskId: $event, groupId: group.id })"
				></TaskPreview>
			</Draggable>
		</Container>
		<section class="task-preview add-task">
			<div class="task">
				<div class="task-preview-color last-task" :style="{ backgroundColor: groupColor }"></div>
				<input type="checkbox" title="Delete Task" class="task-checkbox" disabled />
			</div>
			<button @click="addTask" class="add-item">+ Add item</button>
		</section>
		<div class="progress-bar">
			<div class="progress-column" v-for="(cmp, idx) in cmpOrder" :key="idx + 50">
				<template v-if="Object.keys(progressObj).includes(cmp)">
					<ProgressBar :group="group" :cmp="cmp" :progressObj="progressObj"></ProgressBar>
				</template>
				<Timeline
					v-if="cmp === 'timeline' && timelineProgress"
					:groupColor="group.style.color"
					:info="timelineProgress"
					:isProgressBar="true"
				></Timeline>
			</div>
		</div>

		<RemoveModal v-if="isModalOpen" @closeModal="handleCloseModal" @remove="handleRemoveGroup"
			>group</RemoveModal
		>
	</section>
</template>

<script>
import ProgressBar from './dynamicCmps/ProgressBar.vue'
import Menu from '../assets/svg/Menu.svg'
import RemoveModal from './util/RemoveModal.vue'
// import MenuModal from './dynamicModals/MenuModal.vue'
import { Container, Draggable } from 'vue3-smooth-dnd'
import TaskPreview from './TaskPreview.vue'
import Title from './dynamicCmps/Title.vue'
import Timeline from './dynamicCmps/Timeline.vue'
export default {
	emits: [
		'saveTask',
		'removeTask',
		'saveGroup',
		'removeGroup',
		'applyTaskDrag',
		'addTask',
		'saveGroupTitle',
	],
	props: {
		group: Object,
		cmpOrder: Array,
	},
	created() {
		this.groupTitle = this.group.title
	},
	data() {
		return {
			groupTitle: null,
			isModalOpen: false,
			isMenuModalOpen: false,
			progressObj: {
				status: {
					colors: ['#00c875', '#fdab3d', '#e2445c', '#c4c4c4'],
					words: ['Done', 'Working on it', 'Stuck', ''],
				},
				priority: {
					colors: ['#333333', '#401694', '#5559df', '#579bfc', '#c4c4c4'],
					words: ['Critical', 'High', 'Medium', 'Low', ''],
				},
			},
			dropPlaceholderOptions: {
			    className: 'drop-preview',
			    animationDuration: '150',
			    showOnTop: true
			}
		}
	},
	methods: {
		capitalizeFirstLetter(str) {
			return str.charAt(0).toUpperCase() + str.slice(1)
		},
		saveGroupTitle() {
			const payload = { title: this.groupTitle, groupId: this.group.id }
			this.$emit('saveGroupTitle', payload)
		},
		removeGroup() {
			this.$emit('removeGroup', this.group.id)
		},
		openModal() {
			this.isModalOpen = true
		},
		handleRemoveGroup() {
			this.isModalOpen = false
			this.$emit('removeGroup', this.group.id)
		},
		handleCloseModal() {
			this.isModalOpen = false
		},
		onTaskDrop(dropPayload) {
			const { removedIndex, addedIndex } = dropPayload
			if (removedIndex === null && addedIndex === null) return
			const removedId = this.group.tasks.find((task, idx) => idx === removedIndex).id
			const addedId = this.group.tasks.find((task, idx) => idx === addedIndex).id
			const payload = { removedId, addedId, groupId: this.group.id }
			this.$emit('applyTaskDrag', payload)
		},
		toggleMenuModal() {
			//placeholder for menu modal
			this.isMenuModalOpen = !this.isMenuModalOpen
			this.isModalOpen = true
		},
		getCardPayload(ev) {
			// console.log('getCardPayload',ev)
		},
		addTask() {
			this.$emit('addTask', this.group.id)
		},
		// onDragStart(name,{payload}) {
		//     console.log('onDragStart', payload)
		// },
		// onDragEnd(name,{payload}) {
		//     console.log('onDragEnd', payload)
		// },
	},
	computed: {
		groupColor() {
			return this.group.style.color
		},
		timelineProgress() {
			const timelineProgress = {
				startDate: this.startDate,
				dueDate: this.dueDate
			}
			return timelineProgress
		},
		startDate() {
			const startDate = Math.min(
				...this.group.tasks
					.filter((task) => typeof task.timeline?.startDate === 'number' && task.timeline.startDate > 0)
					.map((task) => task.timeline.startDate)
			)
			if (startDate < 0) return null
			return startDate
		},
		dueDate() {
			const dueDate = Math.max(
				...this.group.tasks
					.filter((task) => typeof task.timeline?.dueDate === 'number' && task.timeline.dueDate > 0)
					.map((task) => task.timeline.dueDate)
			)
			if (dueDate < 0) return null
			return dueDate
		},
	},
	components: {
		TaskPreview,
		Container,
		Draggable,
		RemoveModal,
		Menu,
		Title,
		ProgressBar,
		Timeline,
		//  MenuModal,
	},
}
</script>
