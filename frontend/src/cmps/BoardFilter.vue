<template @keydown.escape="showModal = false">
	<section class="board-filter">
		<div class="add-new-btns">
			<button @click="addTask">New Task</button>
			<span @click="openModal('AddItemModal')" class="add-new-group-btn"
				><OpenOptions class="svg-icon"
			/></span>
		</div>
		<div
			class="search-tasks"
			:class="{ 'input-open': isSearchClicked, filtering: isFiltering, selected: txt }"
			@click="searchClicked"
		>
			<Search class="svg-img"></Search>
			<input
				class="search-input"
				:class="{ open: isSearchClicked || isFiltering }"
				type="text"
				placeholder="Search"
				@blur="isSearchClicked = false"
				v-model="txt"
				@input="setFilter({ txt })"
			/>
			<div v-if="txt" class="svg-small" @click.stop="clearFilter('txt')">
				<CloseRound></CloseRound>
			</div>
		</div>

		<div
			@click="openModal('MemberFilter')"
			@mouseover="showTitleModal = true"
			@mouseout="showTitleModal = false"
			class="person-attach"
			:class="{ selected: filterMember }"
		>
			<img v-if="filterMember" :src="filterMember.imgUrl" />
			<PersonRound v-else></PersonRound>
			<button>Person</button>
			<div v-if="filterMember" class="svg-small" @click.stop="clearFilter('member')">
				<CloseRound></CloseRound>
			</div>
		</div>
		<div class="filter" @click="openModal('FilterModal')">
			<Filter class="svg-img"></Filter>
			<button>Filter</button>
		</div>
		<!-- <div class="sort">
            <span v-svg-icon="'sort'"></span>
            <button>Sort</button>
        </div> -->

		<MenuModal
			@closeModal="showModal = false"
			v-if="showModal"
			:class="modalName + '-style'"
			:cmp="modalName"
			@addGroup="addGroup"
			@addTask="addTask"
			@setFilter="setFilter"
			@advanceFilter="advanceFilter"
		/>
	</section>
</template>
<script>
// import titleModal from './dynamic-modals/title-modal.vue'
// import regularModal from './dynamic-modals/regular-modal.vue'
import Search from '../assets/svg/Search.svg'
import PersonRound from '../assets/svg/PersonRound.svg'
import Filter from '../assets/svg/Filter.svg'
import OpenOptions from '../assets/svg/OpenOptions.svg'
import CloseRound from '../assets/svg/CloseRound.svg'
import MenuModal from '../cmps/dynamicModals/MenuModal.vue'
export default {
	name: 'BoardFilter',
	props: {},
	emits: ['setFilter', 'addTask', 'addGroup'],
	data() {
		return {
			showModal: false,
			showTitleModal: false,
			modalName: '',
			isSearchClicked: false,
			isFiltering: false,
			txt: '',
			filterMember: null,
		}
	},
	methods: {
		addTask() {
			this.$emit('addTask')
		},
		addGroup() {
			this.$emit('addGroup')
		},
		openModal(modalName) {
			this.showTitleModal = false
			this.modalName = modalName
			this.showModal = true
		},
		searchClicked() {
			this.isSearchClicked = true
			document.querySelector('.search-tasks input').focus()
		},

		setFilter(filterBy) {
			let { txt, member } = filterBy
			txt = txt ? txt : this.txt
			member = member ? member : this.filterMember
			this.filterMember = member
			this.txt = txt
			this.isFiltering = txt ? true : false
			filterBy = { txt, member }
			this.$emit('setFilter', filterBy)
		},
		advanceFilter(advanceFilter) {
			this.$emit('advanceFilter', advanceFilter)
		},

		resetFilter() {
			this.txt = this.filterBy.txt || ''
			this.filterMember = this.filterBy.member || null
			this.isFiltering = false
		},

		clearFilter(type) {
			if (type === 'txt') {
				this.isFiltering = false
				this.txt = ''
			}
			if (type === 'member') {
				this.filterMember = null
			}
			const filterBy = { txt: this.txt, member: this.filterMember }
			this.$emit('setFilter', filterBy)
		},
	},
	computed: {
		filterBy() {
			const filterBy = this.$store.getters.filterBy
			return filterBy
		},
	},
	watch: {
		'$route.params': {
			handler() {
				this.resetFilter()
			},
			// deep: true,
			// immediate: true,
		},
	},

	components: { Search, PersonRound, Filter, OpenOptions, CloseRound, MenuModal },
}
</script>
