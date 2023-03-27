<template>
	<section @keydown.escape="closeModal" class="menu-modal" v-click-outside="closeModal">
		<component :is="cmp" @addGroup="addGroup" @addTask="addTask" @setFilter="setFilter" />
	</section>
</template>

<script>
import AddItemModal from './AddItemModal.vue'
import MemberFilter from './MemberFilter.vue'
import RenameDeleteModal from './RenameDeleteModal.vue'
export default {
	name: 'menu-modal',
	emits: ['closeModal', 'addTask', 'addGroup', 'setFilter'],
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
	},
	components: {
		AddItemModal,
		RenameDeleteModal,
		MemberFilter,
	},
}
</script>
