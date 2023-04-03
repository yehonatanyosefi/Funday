<template>
	<section class="board-group">
		<div class="group-header-container">
			<h4 class="group-header">
				<div class="menu-btn-wrapper">
					<div class="menu-btn-container">
						<Menu
							class="svg-icon menu-btn"
							width="20"
							height="20"
							@click="$emit('selectGroupTasks', group.id)"
						/>
					</div>
				</div>
				<ExpandGroup
					@click="$emit('minimizeGroup', group.id)"
					class="arrow"
					title="Minimize Group"
					:style="{ color: group.style.color }"
				></ExpandGroup>
				<div class="group-title-input">
					<label for="groupTitleInput" v-click-outside="hideCircle">
						<div
							v-if="isCircleShown"
							class="color-circle"
							@click.stop="openColorPicker"
							:style="{ backgroundColor: group.style.color }"
						></div>
						<input
							class="board-input group-title-input"
							name="groupTitleInput"
							id="groupTitleInput"
							v-model="groupTitle"
							type="text"
							:style="{ color: group.style.color }"
							:ref="'groupTitleInput' + group.id"
							@blur="saveGroupTitle"
							@keyup.enter="unfocus('groupTitleInput' + group.id)"
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
					<div class="group-preview-color" :style="{ backgroundColor: group.style.color }"></div>
					<div class="task-checkbox-container">
						<input
							type="checkbox"
							title="Delete Group"
							class="task-checkbox"
							:checked="selectedTasks?.length === group.tasks?.length"
							@click="$emit('selectGroupTasks', group.id)"
						/>
						<!-- v-model="isActionsModalOpen" -->
					</div>
					<section class="task-title">Task</section>
				</div>
			</div>
			<section class="task-container" v-for="(cmp, idx) in cmpOrder" :key="idx">
				<div class="task">{{ capitalizeFirstLetter(cmp) }}</div>
			</section>
		</div>

		<Container
			v-if="!isMobile"
			orientation="vertical"
			class="group"
			@drop="onTaskDrop($event)"
			:drop-placeholder="dropPlaceholderOptions"
			dragClass="dragged-element"
		>
			<Draggable v-for="(task, idx) in group.tasks" :key="task.id">
				<TaskPreview
					:idx="idx"
					:task="task"
					:groupColor="group.style.color"
					:cmpOrder="cmpOrder"
					:isSelected="isSelected(task.id)"
					@removeTask="$emit('removeTask', { taskId: $event, groupId: group.id })"
					@saveTask="$emit('saveTask', { task: $event, groupId: group.id })"
					@toggleSelectTask="
						$emit('toggleSelectTask', {
							taskId: $event,
							groupId: group.id,
							groupColor: group.style.color,
						})
					"
				></TaskPreview>
			</Draggable>
		</Container>
		<div v-else v-for="(task, idx) in group.tasks" :key="task.id">
			<TaskPreview
				:idx="idx"
				:task="task"
				:groupColor="group.style.color"
				:cmpOrder="cmpOrder"
				:isSelected="isSelected(task.id)"
				@removeTask="$emit('removeTask', { taskId: $event, groupId: group.id })"
				@saveTask="$emit('saveTask', { task: $event, groupId: group.id })"
				@toggleSelectTask="
					$emit('toggleSelectTask', {
						taskId: $event,
						groupId: group.id,
						groupColor: group.style.color,
					})
				"
			></TaskPreview>
		</div>
		<section class="task-preview add-task">
			<div class="task-sticky task task-title-container add-task-container">
				<div class="menu-btn-wrapper-task"></div>
				<div class="task-checkbox-container">
					<div
						class="task-preview-color last-task"
						:style="{ backgroundColor: group.style.color }"
					></div>
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
			<div class="sticky-progress-bar"></div>
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
	</section>
</template>

<script>
import ExpandGroup from '../assets/svg/ExpandGroup.svg'
import ProgressBar from './dynamicCmps/ProgressBar.vue'
import Menu from '../assets/svg/Menu.svg'
import { Container, Draggable } from 'vue3-smooth-dnd'
import TaskPreview from './TaskPreview.vue'
import Title from './dynamicCmps/Title.vue'
import Timeline from './dynamicCmps/Timeline.vue'
import ColorPicker from './util/ColorPicker.vue'
export default {
	emits: [
		'saveTask',
		'removeTask',
		'saveGroup',
		'removeGroup',
		'applyTaskDrag',
		'addTask',
		'saveGroupAtt',
		'toggleMenuModal',
		'toggleSelectTask',
		'selectGroupTasks',
		'minimizeGroup',
	],
	props: {
		group: Object,
		cmpOrder: Array,
		selectedTasks: Array,
	},
	created() {
		this.groupTitle = this.group.title
	},
	data() {
		return {
			isCircleShown: false,
			openColorPickerModal: false,
			addTaskTitle: '',
			groupTitle: null,
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
		}
	},
	methods: {
		toggleSelectTask(taskId) {
			this.$emit('toggleSelectTask', { taskId, groupId: this.group.id })
		},
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
		onTaskDrop(dropPayload) {
			const removedIndex = dropPayload.removedIndex
			const addedIndex = dropPayload.addedIndex
			if (removedIndex === null || addedIndex === null || addedIndex === removedIndex) return
			const removedId = this.group.tasks.find((task, idx) => idx === removedIndex).id
			const addedId = this.group.tasks.find((task, idx) => idx === addedIndex).id
			const payload = { removedId, addedId, groupId: this.group.id }
			this.$emit('applyTaskDrag', payload)
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
		isSelected(taskId) {
			return this.selectedTasks?.some((selectedTask) => selectedTask.taskId === taskId)
		},
		unfocus(el) {
			if (this.openColorPickerModal) return
			this.$refs[el].blur()
			this.hideCircle()
		},
	},
	computed: {
		groupColor() {
			return this.group.style.color
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
		isMobile() {
			const mobileScreenWidthThreshold = 768
			return window.innerWidth <= mobileScreenWidthThreshold
		},
	},
	components: {
		TaskPreview,
		Container,
		Draggable,
		Menu,
		Title,
		ProgressBar,
		Timeline,
		ColorPicker,
		ExpandGroup,
	},
}
</script>
