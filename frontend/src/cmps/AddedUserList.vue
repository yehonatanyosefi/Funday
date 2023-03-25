<template>
	<ul class="added-users " v-if="addedUsers.length">
		<li v-for="user in addedUsers">
			<div class="item-wrapper">
				<div class="person-token">
					<img class="profile-picture" :src=user.imgUrl>
					<div class="fullname">{{ user.fullname }}</div>
					<div class="clear-btn" @click="$emit('deleteAddedUser',user)"><Close class="svg-icon" height="12px" width="7px" /></div>
					<!-- <Close class="svg-icon clear-btn" height="12px" width="7px" /> -->
				</div>
			</div>
		</li>
	</ul>
</template>
<script>
import Close from '../assets/svg/Close.svg'


export default {
	props: {
		addedUsers: Array,
	},
	mounted() {

	},
	computed: {
		
	},
	components:{
		Close
	}
}
</script>
