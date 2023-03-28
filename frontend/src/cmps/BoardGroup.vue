<template>
	<section class="board-group">
		<div class="group-header-container">
			<h4 class="group-header">
				<div class="menu-btn-wrapper">
					<div class="menu-btn-container">
						<Menu class="svg-icon menu-btn" width="20" height="20" @click="toggleMenuModal" />
					</div>
				</div>
				<div class="group-title-input">
					<label for="groupTitleInput" v-click-outside="hideCircle">
						<div
							v-if="isCircleShown"
							class="color-circle"
							@click.stop="openColorPicker"
							:style="{ backgroundColor: groupColor }"
						></div>
						<input
							class="board-input group-title-input"
							name="groupTitleInput"
							id="groupTitleInput"
							:ref="'groupTitleInput' + group.id"
							v-model="groupTitle"
							:style="{ color: groupColor }"
							type="text"
							@input="saveGroupTitle"
							@focus="showCircle"
						/>
					</label>
					<ColorPicker
						@click.stop
						v-if="openColorPickerModal"
						v-click-outside="closeColorPicker"
						@closeColorPicker="closeColorPicker"
						@chooseColor="chooseGroupColor"
					></ColorPicker>
				</div>
				<div class="task-count">{{ group.tasks.length }} Tasks</div>
			</h4>
		</div>
		<div class="task-header">
			<div class="task-title-group task-sticky task-container">
				<div class="menu-btn-wrapper-task"></div>
				<div class="task">
					<div class="group-preview-color" :style="{ backgroundColor: groupColor }"></div>
					<div class="task-checkbox-container">
						<input
							type="checkbox"
							title="Delete Task"
							class="task-checkbox"
							v-model="isActionsModalOpen"
						/>
					</div>
					<section class="task-title">Task</section>
				</div>
			</div>
			<section class="task-container" v-for="(cmp, idx) in cmpOrder" :key="idx">
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
					:idx="idx"
					:task="task"
					:groupColor="group.style.color"
					:cmpOrder="cmpOrder"
					@saveTask="$emit('saveTask', { task: $event, groupId: group.id })"
					@removeTask="$emit('removeTask', { taskId: $event, groupId: group.id })"
				></TaskPreview>
			</Draggable>
		</Container>

		<section class="task-preview add-task">
			<div class="task-sticky task task-title-container add-task-container">
				<div class="menu-btn-wrapper-task"></div>
				<div class="task-checkbox-container">
					<div class="task-preview-color last-task" :style="{ backgroundColor: groupColor }"></div>
					<!-- :style="borderStyle" -->
					<input type="checkbox" class="task-checkbox" disabled />
				</div>
				<input
					v-model="addTaskTitle"
					@blur="addTask"
					@keyup.enter="addTask"
					class="board-input add-task-input"
					placeholder="+ Add task"
				/>
			</div>
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
		<ActionsModal
			v-if="isActionsModalOpen"
			@closeActionsModal="closeActionsModal"
			@openRemoveModal="openRemoveModal"
		></ActionsModal>
		<RemoveModal v-if="isRemoveModalOpen" @closeModal="closeRemoveModal" @remove="handleRemoveGroup"
			>group</RemoveModal
		>
	</section>
</template>

<script>
import ProgressBar from './dynamicCmps/ProgressBar.vue'
import Menu from '../assets/svg/Menu.svg'
import RemoveModal from './util/RemoveModal.vue'
import { Container, Draggable } from 'vue3-smooth-dnd'
import TaskPreview from './TaskPreview.vue'
import Title from './dynamicCmps/Title.vue'
import Timeline from './dynamicCmps/Timeline.vue'
import ColorPicker from './util/ColorPicker.vue'
import ActionsModal from './util/ActionsModal.vue'
export default {
	emits: [
		'saveTask',
		'removeTask',
		'saveGroup',
		'removeGroup',
		'applyTaskDrag',
		'addTask',
		'saveGroupAtt',
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
			isActionsModalOpen: false,
			isCircleShown: false,
			openColorPickerModal: false,
			addTaskTitle: '',
			groupTitle: null,
			isRemoveModalOpen: false,
			isMenuModalOpen: false,
			hideSetTimeout: null,
			progressObj: {
				status: {
					words: ['Done', 'Working on it', 'Stuck', ''],
					colors: ['#00c875', '#fdab3d', '#e2445c', '#c4c4c4'],
				},
				priority: {
					words: ['Critical', 'High', 'Medium', 'Low', ''],
					colors: ['#333333', '#401694', '#5559df', '#579bfc', '#c4c4c4'],
				},
			},
			dropPlaceholderOptions: {
				className: 'drop-preview',
				animationDuration: '150',
				showOnTop: true,
			},
			upperDropPlaceholderOptions: {
				className: 'cards-drop-preview',
				animationDuration: '150',
				showOnTop: true,
			},
		}
	},
	methods: {
		capitalizeFirstLetter(str) {
			return str.charAt(0).toUpperCase() + str.slice(1)
		},
		saveGroupTitle() {
			const payload = {
				attName: 'title',
				att: this.groupTitle,
				groupId: this.group.id,
			}
			this.$emit('saveGroupAtt', payload)
		},
		chooseGroupColor(color) {
			const style = { color }
			const payload = { attName: 'style', att: style, groupId: this.group.id }
			this.isCircleShown = false
			this.$emit('saveGroupAtt', payload)
		},
		removeGroup() {
			this.$emit('removeGroup', this.group.id)
		},
		openRemoveModal() {
			this.isRemoveModalOpen = true
		},
		handleRemoveGroup() {
			this.isRemoveModalOpen = false
			this.$emit('removeGroup', this.group.id)
		},
		closeRemoveModal() {
			this.isRemoveModalOpen = false
		},
		onTaskDrop(dropPayload) {
			const removedIndex = dropPayload.removedIndex || null
			const addedIndex = dropPayload.addedIndex || null
			if (!removedIndex || !addedIndex) return
			const removedId = this.group.tasks.find((task, idx) => idx === removedIndex).id
			const addedId = this.group.tasks.find((task, idx) => idx === addedIndex).id
			const payload = { removedId, addedId, groupId: this.group.id }
			this.$emit('applyTaskDrag', payload)
		},
		toggleMenuModal() {
			//placeholder for menu modal
			this.isMenuModalOpen = !this.isMenuModalOpen
			this.isRemoveModalOpen = true
		},
		getCardPayload(ev) {
			// console.log('getCardPayload',ev)
		},
		addTask() {
			const title = this.addTaskTitle
			if (!title) return
			const payload = { title, groupId: this.group.id }
			this.$emit('addTask', payload)
			this.addTaskTitle = ''
		},
		openColorPicker() {
			this.openColorPickerModal = true
		},
		closeColorPicker() {
			this.openColorPickerModal = false
			this.isCircleShown = false
		},
		hideCircle() {
			if (this.openColorPickerModal) return
			this.isCircleShown = false
		},
		showCircle() {
			this.isCircleShown = true
		},
		openActionsModal() {
			this.isActionsModalOpen = true
		},
		closeActionsModal() {
			this.isActionsModalOpen = false
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
		borderStyle() {
			//TODO opacity
			return { borderInlineStart: `6px solid ${this.groupColor}` }
		},
		timelineProgress() {
			const timelineProgress = {
				startDate: this.startDate,
				dueDate: this.dueDate,
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
		ColorPicker,
		ActionsModal,
		//  MenuModal,
	},
}
</script>
