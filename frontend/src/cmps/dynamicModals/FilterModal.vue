<template>
	<section class="multi-filter-modal flex column">
		<div class="multi-filter-header flex">
			<div class="left-section">
				<div class="title">Quick filters</div>
				<span>Showing all of {{ totalTasks }} items</span>
			</div>
			<div class="right-section">
				<div class="clear-all">
					<span @click="clearFilter" :class="{ bold: isFiltered }">Clear all</span>
				</div>
			</div>
		</div>
		<section class="filter-area flex column">
			<div class="filter-area-title">
				<h2>All columns</h2>
			</div>
			<div class="filter-groups">
				<FilterColumn
					v-for="(column, idx) in columns()"
					:column="column"
					:data="dataMap[column]"
					:key="idx"
					@setAdvanceFilter="setAdvanceFilter"
				/>
			</div>
		</section>
	</section>
</template>
<script>
import { toRaw } from 'vue'
import FilterColumn from './FilterColumn.vue'
export default {
	name: 'advanced-filter',
	props: {
		filter: Object,
	},
	emits: ['advanceFilter'],
	data() {
		return {
			filterItems: null,
			isFiltered: false,
		}
	},
	created() {},
	computed: {
		dataMap() {
			return this.getBoardData()
		},

		// formattedProps() {
		// 	const columns = []
		// 	columns.push(...Object.keys(this.dataMap))
		// 	const props = this.dataMap?.group?.length ? [this.dataMap.group] : []
		// 	columns.forEach((title) => props.push(this.dataMap.tasks[title]))
		// 	if (this.dataMap?.group?.length) columns.unshift('group')
		// 	return { props, columns }
		// },

		board() {
			return this.$store.getters.filteredBoard
		},

		totalTasks() {
			const board = toRaw(this.board)
			return board.groups.reduce((count, group) => count + group.tasks.length, 0)
		},
	},
	methods: {
		columns() {
			return Object.keys(toRaw(this.dataMap))
		},
		setAdvanceFilter(advanceFilter) {
			this.$emit('advanceFilter', advanceFilter)
		},
		clearFilter() {
			this.$emit('advanceFilter', {})
			this.$emit('closeModal')

			// this.$store.commit({ type: 'filterBoard', filter: {} })
		},

		getBoardData() {
			const board = toRaw(this.board)
			if (!board._id) return {}
			const data = {
				person: board.members,
				group: {},
				priority: {},
				status: {},
			}

			data.group = board.groups.map((group) => group.title)
			// data.task = board.groups.map((group) => group).map((task) => task.title)
			data.status = ['Done', 'Working on it', 'Stuck', '']
			data.priority = ['Critical', 'High', 'Medium', 'Low', '']

			return data

			// board.groups.forEach((group) => {
			// 	data.group[group.id].total += group.tasks.length
			// 	group.tasks.forEach((task) => {
			// 		if (task.status) {
			// 			if (!data.group[group.id].status[task.status]) data.group[group.id].status[task.status] = 0
			// 			data.status[task.status]++
			// 			data.group[group.id].status[task.status]++
			// 		}
			// 		if (task.priority) {
			// 			if (!data.group[group.id].priority[task.priority])
			// 				data.group[group.id].priority[task.priority] = 0
			// 			data.priority[task.priority]++
			// 			data.group[group.id].priority[task.priority]++
			// 		}
			// 		task.person?.forEach((person) => {
			// 			data.person[person].total++
			// 			if (task.status) {
			// 				if (!data.person[person].status) data.person[person].status = {}
			// 				if (!data.person[person].status[task.status]) data.person[person].status[task.status] = 0
			// 				data.person[person].status[task.status]++
			// 			}
			// 			if (task.priority) {
			// 				if (!data.person[person].priority) data.person[person].priority = {}
			// 				if (!data.person[person].priority[task.priority])
			// 					data.person[person].priority[task.priority] = 0
			// 				data.person[person].priority[task.priority]++
			// 			}
			// 		})
			// 	})
			// })
		},

		// getBoardStats() {
		// 	const board = this.board
		// 	const dataMap = this.dataMap
		// 	const taskDataMap = dataMap.tasks
		// 	const valCountMap = {}
		// 	const taskCount =
		// 		board.groups?.reduce((taskCounter, group) => {
		// 			if (!valCountMap[group.title]) valCountMap[group.title] = 0
		// 			valCountMap[group.title]++
		// 			taskCounter += group.tasks.length
		// 			group.tasks.forEach((task) => {
		// 				for (const key in taskDataMap) {
		// 					const value = task[key]
		// 					if (value && taskDataMap[key].includes(value)) {
		// 						if (!valCountMap[value]) valCountMap[value] = 0
		// 						valCountMap[value]++
		// 					}
		// 				}
		// 			})
		// 			return taskCounter
		// 		}, 0) || {}
		// 	return { valCountMap, taskCount }
		// },
	},
	components: {
		FilterColumn,
	},
}
</script>
