<template>
	<section class="board-group">
		<h4 class="group-header">
			<div class="menu-btn-container">
				<Menu class="svg-icon menu-btn" width="20" height="20" @click="toggleMenuModal" />
			</div>
			<div
				class="group-title-input"
				tabindex="0"
      			ref="groupTitleInputDiv"
				@click="focusGroupTitle">
				<div
					v-if="isCircleShown"
					class="color-circle"
					@click.stop="openColorPicker"
					:style="{ backgroundColor: groupColor }"></div>
				<input
					ref="groupTitleInput"
					v-model="groupTitle"
					:style="{ color: groupColor }"
					type="text"
					@input="saveGroupTitle"
					@blur="hideCircle"
					@focus="showCircle" />
				<ColorPicker
					@click.stop
					v-if="openColorPickerModal"
					v-click-outside="closeColorPicker"
					@closeColorPicker="closeColorPicker"
					@chooseColor="chooseGroupColor"></ColorPicker>
			</div>
			<div class="task-count">{{group.tasks.length}} Tasks</div>
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
		<section class="task-preview add-task"
			@mouseover="mouseOverAddTask = true"
			@mouseout="mouseOverAddTask = false">
			<div class="task">
				<div class="task-preview-color last-task" :style="{ backgroundColor: addTaskColor }"></div>
				<input type="checkbox" class="task-checkbox" disabled />
			</div>
			<input
				v-model="addTaskTitle"
				@focus="mouseOverAddTask = true"
				@blur="addTask"
				@keyup.enter="addTask"
				class="add-task-input"
				placeholder="+ Add task">
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
					:isProgressBar="true"></Timeline>
			</div>
		</div>

		<RemoveModal
			v-if="isModalOpen"
			@closeModal="handleCloseModal"
			@remove="handleRemoveGroup">group</RemoveModal>
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
			isCircleShown: false,
			openColorPickerModal: false,
			mouseOverAddTask: false,
			addTaskTitle: '',
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
			},
		}
	},
	methods: {
		capitalizeFirstLetter(str) {
			return str.charAt(0).toUpperCase() + str.slice(1)
		},
		saveGroupTitle() {
			const payload = { attName:'title', att: this.groupTitle, groupId: this.group.id }
			this.$emit('saveGroupAtt', payload)
		},
		chooseGroupColor(color) {
			// const style = {color} //TODO fix store
			const payload = { attName:'style', att: color, groupId: this.group.id }
			this.isCircleShown = false
			this.$emit('saveGroupAtt', payload)
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
			this.mouseOverAddTask = false
			const title = this.addTaskTitle
			if (!title) return
			const payload = { title, groupId: this.group.id }
			this.$emit('addTask', payload)
			this.addTaskTitle = ''
		},
		hex2(c) {
			c = Math.round(c);
			if (c < 0) c = 0;
			if (c > 255) c = 255;

			var s = c.toString(16);
			if (s.length < 2) s = "0" + s;

			return s;
		},
		color(r, g, b) {
			return "#" + this.hex2(r) + this.hex2(g) + this.hex2(b)
		},
		lighten(col, light) {
			var r = parseInt(col.substr(1, 2), 16)
			var g = parseInt(col.substr(3, 2), 16)
			var b = parseInt(col.substr(5, 2), 16)
			if (light < 0) {
				r = (1 + light) * r;
				g = (1 + light) * g
				b = (1 + light) * b
			} else {
				r = (1 - light) * r + light * 255
				g = (1 - light) * g + light * 255
				b = (1 - light) * b + light * 255
			}
			return this.color(r, g, b)
		},
		openColorPicker() {
			this.openColorPickerModal = true
		},
		closeColorPicker() {
			this.openColorPickerModal = false
			this.isCircleShown = false
		},
		hideCircle() {
			setTimeout(()=>{
				if (this.openColorPickerModal) return
				this.isCircleShown = false
			},70)
		},
		showCircle() {
			this.isCircleShown = true
		},
		focusGroupTitle() {
      		// this.$refs.groupTitleInputDiv.focus()
      		// this.$refs.groupTitleInput.focus()
		},
		// onDragStart(name,{payload}) {
		//     console.log('onDragStart', payload)
		// },
		// onDragEnd(name,{payload}) {
		//     console.log('onDragEnd', payload)
		// },
	},
	computed: {
		addTaskColor() {
			if (this.mouseOverAddTask) return this.group.style.color
			return this.lighten(this.group.style.color, 0.35)
		},
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
		ColorPicker,
		//  MenuModal,
	},
}
</script>
