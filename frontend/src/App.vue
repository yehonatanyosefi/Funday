<template>
  <section>
    <!-- <AppHeader /> -->
    <RouterView/>
    <UserMsg/>
  </section>
</template>

<script>


import { userService } from './services/user.service'
import { store } from './store'

import AppHeader from './cmps/AppHeader.vue'
import UserMsg from './cmps/UserMsg.vue'


export default {

  created() {
    const user = userService.getLoggedinUser()
    if (user)  store.commit({type: 'setLoggedinUser', user})
    this.$store.dispatch({type: 'loadUsers'})
  },
  components: {
    AppHeader,
    UserMsg
  },
}
</script>