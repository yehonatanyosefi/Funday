<template>
	<div class="start-end-date-container" @mouseover="onMouseover" @mouseout="mouseout">
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
			<button v-if="this.info?.dueDate" :style="btnStyle"></button>
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
			defaultRadius: '555px',
			barWidth: 120,
		}
	},
	created() {
		if (this.info?.dueDate === -Infinity) this.info.dueDate = null
		this.value = [
			new Date(this.info?.startDate),
			new Date(this.info?.dueDate || this.info?.startDate || Date.now()),
		]
	},
	computed: {
		btnStyle() {
			const bgc = this.info?.dueDate ? this.groupColor : 'inherit'
			const width = (this.progressDate / 100) * this.barWidth
			const rightRadius = width >= 110 ? this.defaultRadius : '0px'
			const style = {
				backgroundColor: bgc,
				width: width + 'px',
				borderBottomRightRadius: rightRadius,
				borderTopRightRadius: rightRadius,
				borderBottomLeftRadius: leftRadius,
				borderTopLeftRadius: leftRadius,
			}
			return style
		},
		progressDate() {
			const percentage = (this.daysPassed / this.totalDays) * 100
			let percentageDisplay = percentage.toFixed(2)
			if (percentageDisplay > 100) return 100
			if (percentageDisplay < 0) return 0
			return percentageDisplay
		},
		totalDays() {
			return Math.ceil(
				(new Date(this.info?.dueDate) - new Date(this.info?.startDate)) / (1000 * 60 * 60 * 24)
			)
		},
		daysPassed() {
			return Math.floor((new Date() - new Date(this.info?.startDate)) / (1000 * 60 * 60 * 24))
		},
		textDisplay() {
			if (!this.info?.dueDate && !this.mouseOver) return '-'
			if (!this.info?.dueDate && this.mouseOver) return 'Set Date'
			if (this.mouseOver) return this.calculatedDate
			const startDate = this.formattedDate(this.info.startDate)
			const dueDate = this.formattedDate(this.info.dueDate)
			return `${startDate} - ${dueDate}`
		},
		calculatedDate() {
			const days = this.totalDays
			if (days > 31) return Math.round(days / 30) + 'm'
			return days + 'd'
		},
		timelineBgc() {
			if (this.info?.dueDate) {
				return '#333333'
			}
		},
	},
	components: {},
}
</script>
