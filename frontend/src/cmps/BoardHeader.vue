<template>
	<section v-if="board" class="board-header-container">
		<section class="board-header">
			<section class="top-header">
				<div class="board-title-left-container">
					<div :class="{ editing: isEditing }" @keydown.enter.prevent="saveBoardTitle" @blur="saveBoardTitle"
						contenteditable @click="isEditing = true" class="board-title">
						{{ boardTitle }}
					</div>
					<Favorite v-if="!board.isStarred" @click="favorite"></Favorite>
					<FavoriteFull class="selected" v-else @click="favorite"></FavoriteFull>
				</div>
				<div class="board-title-right-container">
					<!-- <div v-if="getlastSeenUserImg" class="last-seen">
            Last seen <img :src="getlastSeenUserImg" alt="" />
          </div> -->
					<div class="invite " @click="isOpen = !isOpen">
						<Invite class="svg-icon" />
						Invite/{{ membersCount }}
						<!-- <a :href="getBoardUrl" target="_blank" rel="noopener noreferrer"></a> -->
						<InviteModal :isOpen="isOpen"
						 @closeModal="closeModal" 
						 @addMember="addMember"
						 @removeMember="removeMember">
						</InviteModal>
					</div>
				</div>
			</section>
			<section class="add-views">
				<div>
					<router-link :to="'/board/' + board._id + '/main-table'">
						<button @click="changeView('table')" class="view-item" :class="{ selected: view === 'table' }">
							<div class="content">
								<Home></Home>
								<p class="view-title">Main Table</p>
							</div>
						</button>
					</router-link>
				</div>

				<span class="separator"></span>
				<router-link :to="'/board/' + board._id + '/kanban'">
					<button @click="changeView('kanban')" class="view-item" :class="{ selected: view === 'kanban' }">
						<div class="content">
							<p class="view-title">Kanban</p>
						</div>
					</button>
				</router-link>
				<span class="separator"></span>
				<router-link :to="'/board/' + board._id + '/dashboard'">
					<button @click="changeView('dashboard')" class="view-item" :class="{ selected: view === 'dashboard' }">
						<div class="content">
							<p class="view-title">Dashboard</p>
						</div>
					</button>
				</router-link>
			</section>

			<BorderFilter :filter="filter" :users="users" @setFilter="setFilter" @addTask="addTask" @addGroup="addGroup"
				@advanceFilter="advanceFilter" />
		</section>
		<!-- <BorderFilter
      v-if="vw > 500"
      :filter="filter"
      :users="users"
      @setFilter="setFilter"
      @addTask="addTask"
      @addGroup="addGroup"
    /> -->
	</section>
</template>
<script>
import Invite from '../assets/svg/Invite.svg'
import Home from '../assets/svg/Home.svg'
import Favorite from '../assets/svg/Favorite.svg'
import FavoriteFull from '../assets/svg/FavoriteFull.svg'
import BorderFilter from './BoardFilter.vue'
import InviteModal from '../cmps/dynamicModals/InviteModal.vue'

export default {
	name: 'board-header',
	emits: ['setFilter', 'addTask', 'addGroup', 'saveBoardTitle'],
	props: {
		users: Array,
		filter: Object,
	},
	data() {
		return {
			isEditing: false,
			view: '',
			lastSeenUserImg: '',
			lastSeenUserId: '',
			isOpen: false
		}
	},
	methods: {
		changeView(viewName) {
			this.view = viewName
		},
		addGroup() {
			this.$store.dispatch({ type: 'addGroup' })
		},
		setFilter(filterBy) {
			this.$store.commit({ type: 'filterBoard', filterBy })
		},
		advanceFilter(advanceFilter) {
			this.$store.commit({ type: 'setAdvanceFilter', advanceFilter })
		},
		saveBoardTitle(ev) {
			this.isEditing = false
			ev.target.blur()
			const val = ev.target.innerText
			const payload = { type: 'title', val }
			this.$store.dispatch({ type: 'updateBoard', payload })
		},

		favorite() {
			const val = !this.board.isStarred
			const payload = { type: 'favorite', val }
			this.$store.dispatch({ type: 'updateBoard', payload })
		},
		addTask() {
			this.$store.dispatch({ type: 'addTask' })
		},
		setLastSeenUserImg(userId = '') {
			const users = this.getUsers
			this.lastSeenUserId = userId
			const user = users?.find((user) => user._id === userId)
			this.lastSeenUserImg =
				user?.imgUrl || 'https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_1280.png'
		},
		goTo(ev) {
			const dest = ev.target.value
			this.$router.push(dest)
		},
		setView() {
			const path = this.$route.path
			if (path.includes('kanban')) this.view = 'kanban'
			else if (path.includes('dashboard')) this.view = 'dashboard'
			else this.view = 'table'
		},
		closeModal() {
			this.isOpen = false
		},
		addMember(userId) {
			this.$store.dispatch({ type: 'addMember', userId })
		},
		removeMember(userId) {
			this.$store.dispatch({ type: 'removeMember', userId })
		}
	},
	components: { BorderFilter, Invite, Favorite, FavoriteFull, Home, InviteModal },
	computed: {
		boardTitle() {
			return this.$store.getters.filteredBoard.title
		},
		board() {
			const board = this.$store.getters.filteredBoard
			return board
		},
		membersCount() {
			return this.board?.members?.length || 1
		},
		getUsers() {
			return this.$store.getters.users
		},
		getlastSeenUserImg() {
			return this.lastSeenUserImg
				? this.lastSeenUserImg
				: 'https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_1280.png'
		},
		loggedinUser() {
			return this.$store.getters.loggedinUser
		},
		// getBoardUrl() {
		// 	return `https://mail.google.com/mail/u/0/?view=cm&fs=1&su=Hey! come join my Funday board &body=You can find it on this link: http://funday.onrender.com${this.$route.fullPath}`
		// },
		vw() {
			return window.innerWidth
		},
	},
	created() {
		this.setView()
		this.setLastSeenUserImg(this.loggedinUser?._id)
	},
	mounted() { },
}
</script>
