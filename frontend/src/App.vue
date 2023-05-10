<template>
	<section>
		<!-- <AppHeader /> -->
		<RouterView />
		<UserMsg />
	</section>
</template>

<script>
import { userService } from './services/user.service'
import { store } from './store'

import AppHeader from './cmps/AppHeader.vue'
import UserMsg from './cmps/UserMsg.vue'

export default {
	async created() {
		const user = userService.getLoggedinUser()
		if (user) store.commit({ type: 'setLoggedinUser', user })
		else await this.$store.dispatch({ type: 'guestLogin' })
		await this.$store.dispatch({ type: 'loadUsers' })
		// await this.$store.dispatch({ type: 'loadBoardList' })
	},
	components: {
		AppHeader,
		UserMsg,
	},
}
</script>
