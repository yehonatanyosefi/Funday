<template>
	<div class="priority" :class="info">
		<div class="label" @click="toggleModal" :class="{ first: isFirst }">
			<span>{{ info }}</span>
			<Alert v-if="info === 'Critical'" class="svg-icon critical-alert-svg" height="15px" width="15px" />
			<!-- <span>⚠️️</span> -->
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
import Alert from '../../assets/svg/Alert.svg'

export default {
	emits: ['saveTask'],
	name: 'Priority',
	props: {
		info: String,
		isFirst: Boolean,
	},
	created() {},
	data() {
		return {
			isOpen: false,
			labels: [
				{ Critical: 'Critical' },
				{ High: 'High' },
				{ Medium: 'Medium' },
				{ Low: 'Low' },
				{ empty: '' },
			],
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
	computed: {},
	components: {
		LabelPicker,
		Alert,
	},
}
</script>
