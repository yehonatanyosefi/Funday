<template>
	<div class="start-end-date-container">
		<el-date-picker
			class="start-end-date"
			v-model="value"
			type="daterange"
			range-separator="To"
			start-placeholder="Start date"
			end-placeholder="End date"
			:size="size"
			@change="change"
			:style="dateStyles"
		/>
		<button
			class="timeline-progress"
			:class="{ 'date-not-set': !isSet }"
			@mouseover="omouseover"
			@mouseleave="mouseleave"
		>
			{{ display }}
		</button>
	</div>
</template>

<script>
export default {
	name: 'Timeline',
	emits: ['saveTask'],
	props: {
		info: Object,
	},
	data() {
		return {
			value: [],
			size: 'small',
			isSet: false,
			text: '',
		}
	},
	methods: {
		change() {
			console.log(this.value)
			const startDate = new Date(this.value[0]).getTime()
			const dueDate = new Date(this.value[1]).getTime()
			const timeline = { startDate, dueDate }
			this.$emit('saveTask', timeline)
		},
		formattedDate(dateToFormat) {
			const date = new Date(dateToFormat)
			const day = date.getDate()
			const monthNames = [
				'Jan',
				'Feb',
				'Mar',
				'Apr',
				'May',
				'Jun',
				'Jul',
				'Aug',
				'Sep',
				'Oct',
				'Nov',
				'Dec',
			]
			const month = monthNames[date.getMonth()]
			return `${month} ${day}`
		},
		omouseover() {
			if (!this.isSet) this.text = 'setDate'
		},
		mouseleave() {
			if (!this.isSet) this.text = '-'
			else {
				const startDate = this.formattedDate(this.info.startDate)
				const dutDate = this.formattedDate(this.info.dutDate)
				this.text = `${startDate} - ${dutDate}`
			}
		},
	},
	computed: {
		dateStyles() {
			return { width: '130px', height: '100%' }
		},
		display() {
			return this.text
		},
	},
	components: {},
	created() {
		console.log('info', this.info)
		if (!this.info?.startDate) this.isSet = false
		this.value = [
			new Date(this.info?.startDate),
			new Date(this.info?.dueDate || this.info?.startDate || Date.now()),
		]
		console.log('value', this.value)
	},
}
</script>
