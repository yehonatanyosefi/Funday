<template>
	<div class="board-group-collapsed-container">
		<div class="board-group-collapsed">
			<div class="group-collapsed-header group-collapsed">
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
				<div class="group-title-collapsed">
					<div class="group-preview-color" :style="{ backgroundColor: group.style.color }"></div>
					<ExpandGroup
						@click="$emit('expandGroup', group.id)"
						class="arrow"
						title="Expand Group"
						:style="{ color: group.style.color }"
					></ExpandGroup>
					<div class="collapsed-text-container">
						<div class="collapsed-title" :style="{ color: group.style.color }">{{ group.title }}</div>
						<div class="collapsed-task-count">{{ group.tasks.length }} Tasks</div>
					</div>
				</div>
			</div>
			<div class="group-collapsed" v-for="(cmp, idx) in cmpOrder" :key="idx + 50">
				<div class="collapsed-progress" v-if="Object.keys(progressObj).includes(cmp)">
					<div v-if="cmp === 'priority'" class="collapsed-text">Priority</div>
					<div v-else-if="cmp === 'status'" class="collapsed-text">Status</div>
					<ProgressBar :group="group" :cmp="cmp" :progressObj="progressObj"></ProgressBar>
				</div>
				<div v-else-if="cmp === 'timeline' && timelineProgress" class="collapsed-timeline">
					<div class="collapsed-text">Timeline</div>
					<Timeline
						:groupColor="group.style.color"
						:info="timelineProgress"
						:isProgressBar="true"
					></Timeline>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import ExpandGroup from '../assets/svg/ExpandGroup.svg'
import Timeline from './dynamicCmps/Timeline.vue'
import ProgressBar from './dynamicCmps/ProgressBar.vue'
import Menu from '../assets/svg/menu.svg'
export default {
	emit: ['selectGroupTasks', 'expandGroup'],
	props: {
		group: Object,
		cmpOrder: Array,
	},
	created() {},
	data() {
		return {
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
		}
	},
	methods: {
		isAComponent(cmp) {
			return this.components.includes(cmp)
		},
	},
	computed: {
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
		Menu,
		Timeline,
		ProgressBar,
		ExpandGroup,
	},
}
</script>
