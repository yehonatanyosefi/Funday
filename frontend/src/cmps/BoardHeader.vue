<template>
  <section class="board-header-container">
    <section class="board-header">
      <section class="top-header">
        <h1
          :class="{editing: isEditing}"
          @keydown.enter.prevent="saveBoardTitle"
          @blur="saveBoardTitle"
          contenteditable
          @click="isEditing = true"
          class="board-title"
        >
          {{ boardTitle }}
        </h1>
        <button><Info class="svg-icon" /></button>
        <!-- <div class="invite">
          <span v-svg-icon="'inviteMember'"></span>
          Invite 
          <a :href="getBoardUrl" target="_blank" rel="noopener noreferrer"></a>
        </div> -->
      </section>
    </section>
  </section>
</template>
<script>
import Info from '../assets/svg/Info.svg'
export default {
  name: 'boardHeader',
  emits: ['setFilter', 'addTask', 'addGroup', 'saveBoardTitle'],
  props: {
    users: [],
    filter: {},
  },
  data() {
    return {
      isEditing: false,
      view: '',
      lastSeenUserImg: '',
      lastSeenUserId: '',
    }
  },
  methods: {
    changeView(viewName) {
      this.view = viewName
    },
    addGroup() {
      this.$emit('addGroup', false)
    },
    setFilter(filter) {
      this.$emit('setFilter', filter)
    },
    saveBoardTitle(ev) {
      this.isEditing = false
      ev.target.blur()
      const val = ev.target.innerText
      this.$emit('saveBoardTitle', val)
    },
    addTask() {
      this.$emit('addTask')
    },
    setLastSeenUserImg(userId = '') {
      const users = this.getUsers
      this.lastSeenUserId = userId
      const user = users?.find((user) => user._id === userId)
      this.lastSeenUserImg =
        user?.imgUrl ||
        'https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_1280.png'
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
  },
  components: {Info},
  computed: {
    boardTitle() {
      return 'Sprint 5'
      // return this.$store.getters.board.title
    },
    board() {
      return this.$store.getters.board
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
    getBoardUrl() {
      return `https://mail.google.com/mail/u/0/?view=cm&fs=1&su=Hey! come join my someday board &body=You can find it on this link: http://somdey.onrender.com${this.$route.fullPath}.com`
    },
    vw() {
      return window.innerWidth
    },
  },
  created() {
    this.setView()
    this.setLastSeenUserImg(this.loggedinUser?._id)
  },
  mounted() {
    socketService.on('user-connected', (userId) => {
      this.setLastSeenUserImg(userId)
    })
  },
}
</script>
