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
			console.log('omouseover')

			if (!this.isSet) this.text = 'setDate'
		},
		mouseleave() {
			console.log('mouseleave')
			if (!this.isSet) this.text = '-'
		},
	},
	computed: {
		dateStyles() {
			return { width: '130px', height: '100%' }
		},
		display() {
			return this.text
			// if (!this.isSet) return '-'
			// const startDate = this.formattedDate(this.info.startDate)
			// const dutDate = this.formattedDate(this.info.dutDate)
			// return `${startDate} - ${dutDate}`
		},
	},
	components: {},
	created() {
		console.log('info', this.info)
		if (!this.info.startDate) this.isSet = false
		this.value = [
			new Date(this.info?.startDate),
			new Date(this.info?.dueDate || this.info?.startDate || Date.now()),
		]
		console.log('value', this.value)
	},
}
</script>
