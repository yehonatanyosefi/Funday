<template>
<div>
     <template v-for="(id,idx) in info" :key="idx">
          <img :src="user(id).imgUrl" :title="user(id).fullname" class="profile-picture">
     </template>
</div>
</template>

<script>
export default {
emits: ['updateTask'],
     name: 'Member',
props: {
     info: Array,
},
created() {

},
data() {
return {

}
},
methods: {
     user(id) {
          return this.users.find(user => user._id === id)
     },
},
computed: {
     users() {
          return this.$store.getters.users
     },
},
components: {

},
}
</script>
