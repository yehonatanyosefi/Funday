<template>
	<section class="dashboard" v-if="statusDataFull && priorityDataFull">
		<DoughnutChart :chartData="statusDataFull" :options="options" />
		<BarChart :chartData="priorityDataFull" :options="options" />
	</section>
</template>

<script>
import { BarChart, DoughnutChart } from 'vue-chart-3'
import { Chart, registerables } from 'chart.js'
Chart.register(...registerables)
export default {
	name: 'Chart',
	components: { BarChart, DoughnutChart },
	data() {
		return {
			statusLabels: ['Done', 'Stuck', 'Working on it', 'Empty'],
			priorityLabels: ['Critical', 'High', 'Medium', 'Low', 'Empty'],
			options: {
				plugins: {
					legend: { display: true },
				},
			},
		}
	},
	async created() {},
	methods: {},
	computed: {
		board() {
			return this.$store.getters.filteredBoard
		},
		priorityData() {
			const priorities = this.board.groups
				.map((group) => {
					return group.tasks.map((task) => (!task.priority ? 'Empty' : task.priority))
				})
				.flat()
			return this.priorityLabels.map((priorityLabel) => {
				return priorities.reduce((acc, priority) => {
					return priorityLabel === priority ? acc + 1 : acc
				}, 0)
			})
		},
		statusData() {
			const statuses = this.board.groups
				.map((group) => {
					return group.tasks.map((task) => (!task.status ? 'Empty' : task.status))
				})
				.flat()
			return this.statusLabels.map((statusLabel) => {
				return statuses.reduce((acc, status) => {
					return statusLabel === status ? acc + 1 : acc
				}, 0)
			})
		},
		priorityDataFull() {
			return {
				labels: this.priorityLabels,
				datasets: [
					{
						data: this.priorityData,
						backgroundColor: ['#333333', '#401694', '#5559df', '#579bfc', '#c4c4c4'],
					},
				],
			}
		},
		statusDataFull() {
			return {
				labels: this.statusLabels,
				datasets: [
					{
						data: this.statusData,
						backgroundColor: ['#00c875', '#fdab3d', '#e2445c', '#c4c4c4'],
					},
				],
			}
		},
	},
}
</script>
