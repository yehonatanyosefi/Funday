<template>
  <div class="profile-div" @click="toggleModal">
    <template v-if="info?.length" v-for="(id, idx) in info" :key="idx">
      <img :src="user(id).imgUrl" :title="user(id).fullname" class="profile-picture" />
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
            <input type="search" placeholder="Search names, roles or teams" @click.stop>
            <Search class="svg-icon" color="#676879" width="16px" height="16px" />
          </div>
  
          <ul class="clean-list">
            Suggested people
            <li v-for="user in users" :key="user._id" class="flex" @click="addUser(user)">
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


export default {
  emits: ['saveTask'],
  name: 'Member',
  props: {
    info: Array,
  },
  created() { },
  data() {
    return {
      isOpen: false,
      addedUsers: [],
      isOpen:false,
    }
  },
  methods: {
    user(id) {
      return this.users.find((user) => user._id === id)
    },
    toggleModal() {
      this.isOpen = !this.isOpen
    },
    addUser(user) {
      console.log('user', user)
      if (this.addedUsers.some(addedUser=> addedUser._id===user._id)) return
      this.addedUsers.push(user)
      this.closeModal()
    },
    deleteAddedUser(user){
      this.addedUsers.pop(user)
    
    },
    closeModal() {
               this.isOpen = false
          },
  },
  computed: {
    users() {
      return this.$store.getters.users
    },
  },
  components: {
    PersonRound,
    Search,
    AddedUserList
  },
}
</script>
