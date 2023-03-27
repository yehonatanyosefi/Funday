<template>
	<section class="MemberFilter">
		<div class="modal-group upper-group flex column">
			<div class="modal-item flex align-center">
				<p class="title">Quick person filter</p>
			</div>
			<div class="modal-item flex align-center">
				<p class="subtitle">Filter items and subitems by person</p>
			</div>
			<div class="modal-item flex align-center">
				<div
					v-for="user in users"
					@click="togglePersonFilter(user._id)"
					:title="user.fullname"
					:class="{ selected: filter?.member._id === user._id }"
					class="filter-user"
					:key="user._id"
				>
					<img :src="user.imgUrl" alt="" />
				</div>
			</div>
		</div>
	</section>
</template>
<script>
export default {
	name: 'MemberFilter',
	emits: ['setFilter'],
	props: {},
	data() {
		return {}
	},
	created() {},
	methods: {
		togglePersonFilter(user) {
			const payload = { member: user }
			this.$emit('setFilter', payload)
		},
	},
	computed: {
		filter() {
			return this.$store.getters.filterBy
		},

		users() {
			const users = this.$store.getters.board.members || []
			console.log('members', users)
			return users
		},

		selectedUser() {
			return this.$store.getters.filter.user
		},
	},
	created() {},
}
</script>
