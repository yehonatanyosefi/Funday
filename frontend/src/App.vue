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

  async created() {
		await this.$store.dispatch({ type: "loadBoardList" })
    const user = userService.getLoggedinUser()
    if (user)  store.commit({type: 'setLoggedinUser', user})
    await this.$store.dispatch({type: 'loadUsers'})
  },
  components: {
    AppHeader,
    UserMsg
  },
}
</script>