<template>
	<section class="board-details dashboard" v-if="statusDataFull && priorityDataFull">
		<div class="dashboard-card">
			<div class="dashboard-card-header">Statuses</div>
			<div class="dashboard-chart">
				<PieChart :chartData="statusDataFull" :options="statusOptions" />
			</div>
		</div>
		<div class="dashboard-card">
			<div class="dashboard-card-header">Priorities</div>
			<div class="dashboard-chart">
				<BarChart :chartData="priorityDataFull" :options="priorityOptions" />
			</div>
		</div>
	</section>
</template>

<script>
import { BarChart, PieChart } from 'vue-chart-3'
import { Chart, registerables } from 'chart.js'
Chart.register(...registerables)
export default {
	name: 'Chart',
	components: { BarChart, PieChart },
	data() {
		return {
			statusLabels: ['Done', 'Working on it', 'Stuck', 'Empty'],
			priorityLabels: ['Critical', 'High', 'Medium', 'Low', 'Empty'],
			statusOptions: {
				plugins: {
					legend: {
						display: true,
						position: 'top',
					},
				},
				
					responsive: true,
					maintainAspectRatio: false,
					scales: {
						y: {
							beginAtZero: true,
							grid: {
								display: false,
							},
						},
					},
				},
				priorityOptions: {
					plugins: {
						legend: { display: false, position: 'bottom'},
					},
					responsive: true,
					maintainAspectRatio: false,
					scales: {
						y: {
							beginAtZero: true,
							grid: {
								display: false,
							},
						},
					},
				},
			}
		},
			async created() { },
		methods: { },
		computed: {
			board() {
				return this.$store.getters.filteredBoard
			},
			priorityData() {
				if (!this.board?.groups) return
				const priorities = this.board?.groups
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
				if (!this.board?.groups) return
				const statuses = this.board?.groups
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
