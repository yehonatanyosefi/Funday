<template>
	<div class="start-end-date-container" @mouseover="onMouseover" @mouseout="mouseout">
		<!-- Background of progress bar -->
		<div class="timeline-progress" :style="{ backgroundColor: timelineBgc }">
			<!-- Inner progress bar -->
			<div v-if="this.info?.dueDate" :style="btnStyle"></div>
			<!-- Text display of progress bar -->
			<div class="timeline-text">
				{{ textDisplay }}
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: 'Timeline',
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
			DAYS: 1000 * 60 * 60 * 24,
		}
	},
	computed: {
		daysPassed() {
			//Days passed from start date until today calculation
			return Math.floor((new Date() - new Date(this.info?.startDate)) / this.DAYS)
		},
		totalDays() {
			//Total days from start date until due date calculation
			return Math.ceil((new Date(this.info?.dueDate) - new Date(this.info?.startDate)) / this.DAYS)
		},
		progressDate() {
			//Percentage of progress calculation
			const percentage = (this.daysPassed / this.totalDays) * 100
			let percentageDisplay = percentage.toFixed(2)
			if (percentageDisplay > 100) return 100
			if (percentageDisplay < 0) return 0
			return percentageDisplay
		},
		btnStyle() {
			//Button style calculation
			const bgc = this.info?.dueDate ? this.groupColor : 'inherit' //Color of background
			const width = (this.progressDate / 100) * this.barWidth //Width of button
			const rightRadius = width >= 110 ? this.defaultRadius : '0px' //Right border radius of button
			const style = {
				//Style of button
				backgroundColor: bgc,
				width: width + 'px',
				borderBottomRightRadius: rightRadius,
				borderTopRightRadius: rightRadius,
				borderBottomLeftRadius: leftRadius,
				borderTopLeftRadius: leftRadius,
			}
			return style
		},
	},
}
</script>
