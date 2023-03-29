<template>
	<section @keydown.escape="closeModal" class="menu-modal" v-click-outside="closeModal">
		<component
			:is="cmp"
			@addGroup="addGroup"
			@addTask="addTask"
			@setFilter="setFilter"
			@advanceFilter="advanceFilter"
			@closeModal="closeModal"
		/>
	</section>
</template>

<script>
import AddItemModal from './AddItemModal.vue'
import MemberFilter from './MemberFilter.vue'
import RenameDeleteModal from './RenameDeleteModal.vue'
import FilterModal from './FilterModal.vue'

export default {
	name: 'menu-modal',
	emits: ['closeModal', 'addTask', 'addGroup', 'setFilter', 'advanceFilter'],
	props: {
		cmp: {
			type: String,
			required: false,
		},
	},
	methods: {
		closeModal() {
			this.$emit('closeModal')
		},
		addGroup() {
			this.$emit('addGroup')
			this.$emit('closeModal')
		},
		addTask() {
			this.$emit('addTask')
			this.$emit('closeModal')
		},
		setFilter(filterBy) {
			this.$emit('setFilter', filterBy)
			this.$emit('closeModal')
		},
		advanceFilter(advanceFilter) {
			this.$emit('advanceFilter', advanceFilter)
		},
		closeModal() {
			this.$emit('closeModal')
		},
	},
	components: {
		AddItemModal,
		RenameDeleteModal,
		MemberFilter,
		FilterModal,
	},
}
</script>
