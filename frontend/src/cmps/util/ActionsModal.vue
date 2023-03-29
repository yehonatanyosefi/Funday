<template>
	<div class="checkbox-actions">
		<div class="num-of-actions">
			{{ numOfActions }}
		</div>
		<div class="num-of-actions-wrapper">
			<div class="title-of-actions">Task<span v-if="numOfActions > 1">s</span> selected</div>
			<div class="num-of-tasks-colors">
				<div
					v-for="(groupColor, idx) in groupColorsArr"
					:key="idx"
					class="num-of-tasks-color"
					:style="{ backgroundColor: groupColor }"
				></div>
			</div>
		</div>
		<div class="action-item">
			<Duplicate></Duplicate>
			Duplicate
		</div>
		<div class="action-item" @click="$emit('openRemoveModal')">
			<Delete></Delete>
			Delete
		</div>
		<div class="exit-actions">
			<div @click="$emit('closeActionsModal')">X</div>
		</div>
	</div>
</template>

<script>
import Delete from '../../assets/svg/Delete.svg'
import Duplicate from '../../assets/svg/Duplicate.svg'
export default {
	emits: ['closeActionsModal', 'openRemoveModal'],
	props: {
		selectedTasks: { type: Object, default: {} },
	},
	created() {},
	data() {
		return {}
	},
	methods: {},
	computed: {
		selectedTasksArr() {
			return Object.values(this.selectedTasks).flat()
		},
		numOfActions() {
			return this.selectedTasksArr?.length
		},
		groupColorsArr() {
			return this.selectedTasksArr.map((task) => task.groupColor)
		},
	},
	components: {
		Delete,
		Duplicate,
	},
}
</script>
