<template>
  <div>
    <template v-if="info?.length" v-for="(id, idx) in info" :key="idx">
      <img
        :src="user(id).imgUrl"
        :title="user(id).fullname"
        class="profile-picture"
      />
    </template>
    <PersonRound v-else class="svg-icon" />
  </div>
</template>

<script>
import PersonRound from '../../assets/svg/PersonRound.svg'
export default {
  emits: ['saveTask'],
  name: 'Member',
  props: {
    info: Array,
  },
  created() {},
  data() {
    return {}
  },
  methods: {
    user(id) {
      return this.users.find((user) => user._id === id)
    },
  },
  computed: {
    users() {
      return this.$store.getters.users
    },
  },
  components: {PersonRound},
}
</script>
