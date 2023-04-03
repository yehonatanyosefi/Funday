<template>
	<div
		class="start-end-date-container"
		@mouseover="onMouseover"
		@mouseout="mouseout"
		style="
			 {
				cursor: 'pointer';
			}
		"
	>
		<el-date-picker
			:disabled="isProgressBar"
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
		<div class="timeline-progress" :style="{ backgroundColor: timelineBgc }">
			<button v-if="this.timelineInfo?.dueDate" :style="btnStyle"></button>
			<div class="timeline-text">
				{{ textDisplay }}
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: 'Timeline',
	emits: ['saveTask'],
	props: {
		info: Object,
		groupColor: String,
		isProgressBar: { type: Boolean, default: false },
	},
	data() {
		return {
			value: [],
			size: 'small',
			mouseOver: false,
			timelineInfo: {
				startDate: null,
				dueDate: null,
			},
		}
	},
	created() {
		this.setTimelineInfo()
	},
	methods: {
		change() {
			const startDate = new Date(this.value[0]).getTime()
			const dueDate = new Date(this.value[1]).getTime()
			const timeline = { startDate, dueDate }
			this.$emit('saveTask', timeline)
		},
		formattedDate(dateToFormat) {
			if (isNaN(dateToFormat)) return '-'
			const date = new Date(dateToFormat)
			const day = date.getDate()
			const month = this.formatMonth(date)
			return `${month} ${day}`
		},
		formatMonth(date) {
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
			return monthNames[date.getMonth()]
		},
		onMouseover() {
			this.mouseOver = true
		},
		mouseout() {
			this.mouseOver = false
		},
		setTimelineInfo() {
			const startDateNum = parseInt(this.info.startDate)
			const dueDateNum = parseInt(this.info.dueDate)
			this.timelineInfo.startDate =
				!startDateNum || isNaN(startDateNum) || startDateNum === Infinity || startDateNum === -Infinity
					? Date.now()
					: startDateNum
			this.timelineInfo.dueDate =
				!dueDateNum || isNaN(dueDateNum) || dueDateNum === Infinity || dueDateNum === -Infinity
					? null
					: dueDateNum
			if (this.timelineInfo?.dueDate === -Infinity) this.timelineInfo.dueDate = null
			this.value = [
				new Date(this.timelineInfo?.startDate),
				new Date(this.timelineInfo?.dueDate || this.timelineInfo?.startDate || Date.now()),
			]
		},
	},
	computed: {
		btnStyle() {
			const bgc = this.timelineInfo?.dueDate ? this.groupColor : 'inherit'
			const width = (this.progressDate / 100) * 120
			let radius = '0px'
			if (width >= 115) {
				radius = '555px'
			}
			return {
				backgroundColor: bgc,
				width: width + 'px',
				borderBottomRightRadius: radius,
				borderTopRightRadius: radius,
				borderBottomLeftRadius: '555px',
				borderTopLeftRadius: '555px',
			}
		},
		dateStyles() {
			return { width: '120px', height: '100%', cursor: 'pointer' }
		},
		timelineBgc() {
			if (this.timelineInfo?.dueDate) {
				return '#333333'
			}
		},
		textDisplay() {
			if (!this.timelineInfo?.dueDate && !this.mouseOver) return '-'
			if (!this.timelineInfo?.dueDate && this.mouseOver) return 'Set Date'
			if (this.mouseOver) return this.calculatedDate
			const startDate = this.formattedDate(this.timelineInfo.startDate)
			const dueDate = this.formattedDate(this.timelineInfo.dueDate)
			return `${startDate} - ${dueDate}`
		},
		progressDate() {
			const percentage = (this.daysPassed / this.totalDays) * 100
			let percentageDisplay = percentage.toFixed(2)
			if (percentageDisplay > 100) return 100
			if (percentageDisplay < 0) return 0
			if (isNaN(percentageDisplay)) percentageDisplay = 100
			return percentageDisplay
		},
		daysPassed() {
			return Math.floor((new Date() - new Date(this.timelineInfo?.startDate)) / (1000 * 60 * 60 * 24))
		},
		totalDays() {
			return Math.ceil(
				(new Date(this.timelineInfo?.dueDate) - new Date(this.timelineInfo?.startDate)) /
					(1000 * 60 * 60 * 24)
			)
		},
		calculatedDate() {
			const days = this.totalDays
			if (days > 31) return Math.round(days / 30) + 'm'
			return days + 'd'
		},
	},
	components: {},
	watch: {
		info() {
			this.setTimelineInfo()
		},
	},
}
</script>
