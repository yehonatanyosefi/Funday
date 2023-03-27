<template>
	<section class="AddItemModal">
		<div class="modal-group flex column align-center">
			<div class="modal-item" @click="addGroup">
				<div class="item-title flex align-center">
					<Group></Group>
					<p class="title">New group of tasks</p>
				</div>
			</div>
			<div class="modal-item flex align-center" @click="addTask">
				<div class="item-title flex align-center">
					<Item></Item>
					<p class="title">New Task</p>
				</div>
			</div>
		</div>
	</section>
</template>
<script>
import Group from '../../assets/svg/Group.svg'
import Item from '../../assets/svg/Item.svg'
export default {
	name: 'AddItemModal',
	emits: ['addGroup', 'addTask'],
	methods: {
		addGroup() {
			this.$emit('addGroup', false)
		},
		addTask() {
			this.$emit('addTask', false)
		},
	},
	components: { Group, Item },
}
</script>
