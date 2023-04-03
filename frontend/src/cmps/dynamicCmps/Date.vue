<template>
	<div>
		<el-date-picker
			ref="datePicker"
			class="dynamic-date"
			type="date"
			v-model="date"
			placeholder="Pick a day"
			:style="dateStyles"
			format="MMM DD"
			@change="select"
		/>
		<!-- {{ formattedDate }} -->
	</div>
</template>

<script>
export default {
	emits: ['saveTask'],
	name: 'Date',
	props: {
		info: Number,
	},
	created() {
		this.date = parseInt(this.info)
	},
	data() {
		return {
			date: null,
		}
	},
	methods: {
		select() {
			const newVal = new Date(this.date).getTime()
			this.$emit('saveTask', newVal)
		},
	},
	computed: {
		formattedDate() {
			const date = new Date(this.info)
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
		dateStyles() {
			return { width: '130px' }
		},
	},
	components: {},
	watch: {
		info() {
			this.date = this.info
		},
	},
}
</script>
