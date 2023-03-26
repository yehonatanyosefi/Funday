<template>
  <div class="profile-div" @click="toggleModal" v-if="users">
    <Add class="add-users"></Add>
    <template v-if="info?.length > 0 && info?.length < 3" v-for="(id, idx) in info" :key="idx">
      <img :src="user(id).imgUrl" :title="user(id).fullname" class="profile-picture" />
    </template>
    <template v-else-if="info.length > 2">
      <img :src="user(info[0]).imgUrl" :title="user(info[0]).fullname" class="profile-picture" />
      <div class="more-users">+{{info?.length-1}}</div>
    </template>
    <!-- <PersonRound class="svg-icon" /> -->
    <img v-else class="default-img" src="https://cdn.monday.com/icons/dapulse-person-column.svg" title="" alt=""
      aria-hidden="true">

    <div class="modal" v-if="isOpen"  v-click-outside="closeModal" @click.stop>
      <div class="modal-container">
        <div class="added-user-list">
          <AddedUserList :addedUsers="addedUsers" @deleteAddedUser="deleteAddedUser"/>
        </div>

        <div class="users-list">

          <div class="search-member">
            <input type="search" v-focus @input="search" v-model="searchTxt" placeholder="Search names" @click.stop>
            <Search class="svg-icon" color="#676879" width="16px" height="16px" />
          </div>
  
          <ul class="clean-list">
            Suggested people
            <li v-for="user in filteredSuggestedUsers" :key="user._id" class="flex" @click="addUser(user)">
              <img class="profile-picture" :src=user.imgUrl>
              <div class="fullname">{{ user.fullname }}</div>
            </li>
  
          </ul>
        </div>

      </div>

    </div>
  </div>
</template>

<script>
import PersonRound from '../../assets/svg/PersonRound.svg'
import Search from '../../assets/svg/Search.svg'
import AddedUserList from '../AddedUserList.vue'
import Add from '../../assets/svg/Add.svg'


export default {
  emits: ['saveTask'],
  name: 'Member',
  props: {
    info: Array,
  },
  created() {
    this.addedUsers = this.info.map(userId => this.user(userId))
    this.search()
  },
  data() {
    return {
      isOpen: false,
      addedUsers: [],
      searchTxt: '',
      filteredSuggestedUsers: [],
    }
  },
  methods: {
    user(id) {
      return this.users?.find((user) => user._id === id)
    },
    toggleModal() {
      this.isOpen = !this.isOpen
    },
    addUser(user) {
      if (this.addedUsers.some(addedUser=> addedUser._id===user._id)) return
      this.addedUsers.push(user)
      const userIds = this.addedUsers.map(user=>user._id)
      this.search()
      this.$emit('saveTask', userIds)
      this.closeModal()
    },
    deleteAddedUser(user){
      this.addedUsers = this.addedUsers.filter(addedUser => addedUser._id !== user._id)
      const userIds = this.addedUsers.map(user=>user._id)
      this.search()
      this.$emit('saveTask', userIds)
    },
    closeModal() {
      this.isOpen = false
    },
    search() {
      this.filteredSuggestedUsers = this.userSuggested?.filter(user=>user.fullname.toLowerCase().includes(this.searchTxt.toLowerCase()))
    }
  },
  computed: {
    users() {
      return this.$store.getters.users
    },
    userSuggested() {
      return this.users?.filter(user => {
        return !this.addedUsers.some(addedUser=>user._id===addedUser._id)
      })
    }
  },
  components: {
    PersonRound,
    Search,
    AddedUserList,
    Add,
  },
  directives: {
    focus: {
      mounted(el) {
        el.focus();
      }
    }
  }
}
</script>
