<template>
	<div>
		<div class="modal-overlay"></div>
		<section
			v-if="isOpen"
			@keydown.escape="closeModal"
			class="modal invite-modal"
			v-click-outside="closeModal"
		>
			<h1>Board members</h1>

			<div class="users-list">
				<div class="search-member">
					<input
						type="search"
						v-focus
						@input="search"
						v-model="searchTxt"
						placeholder="Search names"
						@click.stop
					/>
				</div>

				<div class="board-subscribers">
					Anyone at <b class="bold">{{ loggedinUser.fullname }} account</b> can find and access this
					board
				</div>

				<ul class="clean-list">
					<li class="flex">
						<img class="profile-picture" :src="loggedinUser.imgUrl" />
						<div class="fullname">{{ loggedinUser.fullname }}</div>
						<div class="crown-container">
							<Crown class="svg-icon close" width="11px" height="11px" />
						</div>
						<div class="close-container">
							<Close class="svg-icon close" width="9px" />
						</div>
					</li>
					<li
						v-if="filteredSuggestedUsers.length > 0"
						v-for="user in filteredSuggestedUsers"
						:key="user._id"
						class="flex"
						@click="addMember(user._id)"
					>
						<img class="profile-picture" :src="user.imgUrl" />
						<div class="fullname">{{ user.fullname }}</div>
						<div v-if="isMember(user._id)" class="crown-container">
							<Crown class="svg-icon close" width="11px" height="11px" />
						</div>
						<div v-if="isMember(user._id)" class="close-container" @click.stop="removeMember(user._id)">
							<Close class="svg-icon close" width="9px" />
						</div>
					</li>

					<div v-else class="no-members">No members found</div>
				</ul>
			</div>
		</section>
	</div>
</template>

<script>
import Close from '../../assets/svg/Close.svg'
import Crown from '../../assets/svg/Crown.svg'

export default {
	name: 'invite-modal',
	emits: ['closeModal', 'addMember', 'removeMember'],
	props: {
		isOpen: {
			type: Boolean,
		},
	},
	data() {
		return {
			searchTxt: '',
			filteredSuggestedUsers: [],
		}
	},
	methods: {
		closeModal() {
			this.$emit('closeModal')
		},
		search() {
			this.filteredSuggestedUsers = this.users?.filter(
				(user) =>
					user.fullname.toLowerCase().includes(this.searchTxt.toLowerCase()) &&
					user._id !== this.loggedinUser._id
			)
		},
		isMember(userId) {
			const bool = this.currBoard.members.some((member) => member._id === userId)
			return bool
		},
		addMember(userId) {
			if (this.isMember(userId)) return
			this.$emit('addMember', userId)
		},
		removeMember(userId) {
			console.log(`userId:`, userId)
			this.$emit('removeMember', userId)
		},
	},
	computed: {
		users() {
			return this.$store.getters.users
		},
		loggedinUser() {
			return this.$store.getters.loggedinUser
		},
		currBoard() {
			return this.$store.getters.board
		},
	},
	created() {
		this.search()
	},
	components: {
		Close,
		Crown,
	},
	directives: {
		focus: {
			mounted(el) {
				el.focus()
			},
		},
	},
}
</script>
