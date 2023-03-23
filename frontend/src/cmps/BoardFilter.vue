<template @keydown.escape="showModal = false">
  <section class="board-filter">
    <div class="add-new-btns">
      <button @click="addTask">New Task</button>
      <span
        @click="openModal('new-item-modal')"
        class="add-new-group-btn"
      ></span>
    </div>
    <div
      class="search-tasks"
      :class="{'input-open': isSearchClicked, filtering: isFiltering}"
      @click="searchClicked"
    >
      <Search class="svg-img"></Search>
      <input
        class="search-input"
        :class="{open: isSearchClicked || isFiltering}"
        type="text"
        placeholder="Search"
        @blur="isSearchClicked = false"
        v-model="txt"
        @input="setFilter('txt', txt)"
      />
    </div>
    <div
      @click="openModal('filter-person-modal')"
      @mouseover="showTitleModal = true"
      @mouseout="showTitleModal = false"
      class="person-attach"
    >
      <Person class="svg-img"></Person>
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

    <!-- <regular-modal
      :filter="filter"
      @setFilter="setFilter"
      :users="users"
      @closeModal="showModal = false"
      v-if="showModal"
      :class="modalName + '-parent'"
      :cmp="modalName"
      @addGroup="addGroup" -->
  </section>
</template>
<script>
// import titleModal from './dynamic-modals/title-modal.vue'
// import regularModal from './dynamic-modals/regular-modal.vue'
import Search from '../assets/svg/Search.svg'
import Person from '../assets/svg/Person.svg'
import Filter from '../assets/svg/Filter.svg'
export default {
  name: 'BoardFilter',
  props: {
    users: Array,
    filter: Object,
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
    setFilter(key, val) {
      let filter = JSON.parse(JSON.stringify(this.filter))
      if (key === 'txt') this.isFiltering = !!val
      if (key === 'group' || key === 'txt') filter[key] = val
      else if (key === 'multi') filter = {...filter, ...val}
      else {
        if (!filter.tasks) filter.tasks = {}
        filter.tasks[key] = val
      }
      this.$emit('setFilter', filter)
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
  components: {Search, Person, Filter},
}
</script>
