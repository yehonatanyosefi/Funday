<template>
	<section class="advanced-filter-column">
		<div class="filter-col">
			<div class="title">{{ column }}</div>
			<div class="content flex column">
				<div
					v-if="column === 'person'"
					v-for="item in data"
					class="filter-item person"
					@click="setFilter(item)"
					:class="{ selected: selected(item._id) }"
					:key="item._id"
				>
					<div class="filter-option">
						<div class="img-container">
							<img :src="item.imgUrl" alt="" />
							{{ item.fullname }}
						</div>
					</div>
					<div class="filter-counter">{{}}</div>
				</div>
				<div
					v-else
					v-for="(item, idx) in data"
					class="filter-item"
					@click="setFilter(item)"
					:class="{ selected: selected(item) }"
					:key="idx"
				>
					<div class="filter-option">
						<span v-if="column === 'date'">{{ getFormattedDate(item) }}</span>
						<div v-else-if="column === 'status' || column === 'priority'">
							<span class="label-color" :style="getFormattedLabelStyle(item)"></span>{{ item }}
						</div>
						<span v-else>{{ item }}</span>
					</div>
					<div class="filter-counter">
						<span> {{}}</span>
					</div>
				</div>
			</div>
		</div>
	</section>
</template>
<script>
import { toRaw } from 'vue'
export default {
	name: 'FilterColumn',
	emits: ['setAdvanceFilter'],
	props: {
		column: {
			type: String,
			required: true,
		},
		data: {
			type: Object,
			required: true,
		},
	},
	data() {
		return {
			months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
			status: { Done: '#00c875', 'Working on it': '#fdab3d', Stuck: '#e2445c', '': '#c4c4c4' },
			priority: {
				Critical: '#333333',
				High: '#401694',
				Medium: '#5559df',
				Low: '#579bfc',
				'': '#c4c4c4',
			},
		}
	},
	computed: {
		filter() {
			return this.$store.getters.advanceFilter
		},
	},
	methods: {
		selected(key) {
			const values = toRaw(this.filter)[this.column]
			if (this.column === 'person') {
				return values?.findIndex((curr) => curr._id === key) > -1
			} else {
				if (!values?.length) return false
				return values.includes(key)
			}
		},
		setFilter(item) {
			let filter = toRaw(this.filter)
			if (this.column === 'person') {
				if (filter[this.column]) {
					const idx = filter[this.column].findIndex((curr) => curr._id === item._id)
					if (idx === -1) filter[this.column].push(item)
					else filter[this.column].splice(idx, 1)
				} else {
					filter[this.column] = item
				}
			} else {
				if (!filter[this.column]) {
					filter[this.column] = [item]
				} else {
					const idx = filter[this.column].findIndex((curItem) => curItem === item)
					if (idx === -1) filter[this.column].push(item)
					else filter[this.column].splice(idx, 1)
				}
			}
			this.$emit('setAdvanceFilter', filter)
		},
		getFormattedDate(item) {
			const monthIdx = new Date(item).getMonth()
			return `${this.months[monthIdx]} ${new Date(item).getDate()}`
		},
		getFormattedNumber(item) {
			return item.toLocaleString()
		},

		getFormattedLabelStyle(item) {
			let color = '#c4c4c4'
			if (this.column === 'priority') {
				color = this.priority[item]
			} else if (this.column === 'status') {
				color = this.status[item]
			}
			return `background-color: ${color};`
		},
	},
	components: {},
}
</script>
