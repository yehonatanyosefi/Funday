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
			:class="{ 'input-open': isSearchClicked, filtering: isFiltering }"
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
		</div>
		<div
			@click="openModal('MemberFilter')"
			@mouseover="showTitleModal = true"
			@mouseout="showTitleModal = false"
			class="person-attach"
		>
			<PersonRound></PersonRound>
			<button>Person</button>
		</div>
		<div class="filter" @click="openModal('multi-filter-modal')">
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

import MenuModal from '../cmps/dynamicModals/MenuModal.vue'
export default {
	name: 'BoardFilter',
	props: {
		// users: Array,
		// filter: Object,
	},
	emits: ['setFilter', 'addTask', 'addGroup'],
	data() {
		return {
			showModal: false,
			showTitleModal: false,
			modalName: '',
			isSearchClicked: false,
			isFiltering: false,
			txt: '',
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
			this.$emit('setFilter', filterBy)
		},
		clearFilter() {
			this.isFiltering = false
			this.txt = ''
			this.$emit('setFilter', 'txt', '')
		},
	},
	computed: {
		vw() {
			return window.innerWidth
		},
	},
	components: { Search, PersonRound, Filter, OpenOptions, MenuModal },
}
</script>
