<template>
	<div class="status" :class="{ first: isFirst }">
		<div class="label" :class="statusClass" @click="toggleModal">
			{{ info }}
			<div class="folding-corner"></div>
		</div>
		<LabelPicker
			v-if="isOpen"
			class="modal"
			:labels="labels"
			@saveTask="$emit('saveTask', $event)"
			@closeModal="closeModal"
			v-click-outside="closeModal"
		></LabelPicker>
	</div>
</template>

<script>
import LabelPicker from './LabelPicker.vue'

export default {
	emits: ['saveTask'],
	name: 'Status',
	props: {
		info: String,
		isFirst: Boolean,
	},
	created() {},
	data() {
		return {
			isOpen: false,
			labels: [{ working: 'Working on it' }, { done: 'Done' }, { stuck: 'Stuck' }, { empty: '' }],
		}
	},
	methods: {
		toggleModal() {
			this.isOpen = !this.isOpen
		},
		openModal() {
			this.isOpen = true
		},
		closeModal() {
			this.isOpen = false
		},
	},
	computed: {
		statusClass() {
			return {
				working: this.info === 'Working on it',
				done: this.info === 'Done',
				stuck: this.info === 'Stuck',
				empty: this.info === '',
			}
		},
	},
	components: {
		LabelPicker,
	},
}
</script>
