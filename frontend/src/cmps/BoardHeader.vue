<template>
  <section class="board-header-container">
    <section class="board-header">
      <section class="top-header">
        <div>
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
          <Favorite v-if="!board.isStarred" @click="favorite"></Favorite>
          <FavoriteFull
            class="selected"
            v-else
            @click="favorite"
          ></FavoriteFull>
        </div>
        <div class="board-title-right-container">
          <!-- <div v-if="getlastSeenUserImg" class="last-seen">
            Last seen <img :src="getlastSeenUserImg" alt="" />
          </div> -->
          <div class="invite">
            <Invite class="svg-icon" />
            Invite
            <a
              :href="getBoardUrl"
              target="_blank"
              rel="noopener noreferrer"
            ></a>
          </div>
        </div>
      </section>
      <section class="add-views">
        <router-link :to="'/board/'">
          <button
            @click="changeView('table')"
            class="view-item"
            :class="{selected: view === 'table'}"
          >
            <p class="view-title">Main Table</p>
          </button>
        </router-link>
        <span class="separator">|</span>
        <router-link :to="'/board/kanban/'">
          <button
            @click="changeView('kanban')"
            class="view-item"
            :class="{selected: view === 'kanban'}"
          >
            <p class="view-title">Kanban</p>
          </button>
        </router-link>
        <span class="separator">|</span>
        <router-link :to="'/board/dashboard/'">
          <button
            @click="changeView('dashboard')"
            class="view-item"
            :class="{selected: view === 'dashboard'}"
          >
            <p class="view-title">Dashboard</p>
          </button>
        </router-link>
      </section>

      <BorderFilter
        :filter="filter"
        :users="users"
        @setFilter="setFilter"
        @addTask="addTask"
        @addGroup="addGroup"
      />
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
import Favorite from '../assets/svg/Favorite.svg'
import FavoriteFull from '../assets/svg/FavoriteFull.svg'
import BorderFilter from './BoardFilter.vue'

import {boardService} from '../services/board.service'
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
    }
  },
  methods: {
    changeView(viewName) {
      this.view = viewName
    },
    addGroup() {
      this.$store.dispatch({type: 'addGroup'})
    },
    setFilter(filter) {},
    saveBoardTitle(ev) {
      this.isEditing = false
      ev.target.blur()
      const val = ev.target.innerText
      const payload = {type: 'title', val}
      this.$store.dispatch({type: 'updateBoard', payload})
    },

    favorite() {
      const val = !this.board.isStarred
      const payload = {type: 'favorite', val}
      this.$store.dispatch({type: 'updateBoard', payload})
    },
    addTask() {
      this.$store.dispatch({type: 'addTask'})
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
  components: {BorderFilter, Invite, Favorite, FavoriteFull},
  computed: {
    boardTitle() {
      return this.$store.getters.board.title
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
      return `https://mail.google.com/mail/u/0/?view=cm&fs=1&su=Hey! come join my Funday board &body=You can find it on this link: http://funday.onrender.com${this.$route.fullPath}`
    },
    vw() {
      return window.innerWidth
    },
  },
  created() {
    this.setView()
    this.setLastSeenUserImg(this.loggedinUser?._id)
  },
  mounted() {},
}
</script>
