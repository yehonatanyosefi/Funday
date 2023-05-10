<template>
	<section class="side-bars">
		<section class="sidebar">
			<div class="logo-img">
				<router-link :to="'/'">
					<img src="../assets/funday.png" alt="" />
				</router-link>

			</div>
			<div class="divider"></div>
			<div class="mid-icons flex column">
				<div class="inside-icons flex column">
					<div class="svg-wrapper selected">
						<div class="triangle"></div>
						
						<a class="desktop-table-btn" role="button" >
							<WorkManagement class="svg-icon" />
						</a>

						<a class="mobile-table-btn"  role="button" @click.stop="isMobile=!isMobile">
							<WorkManagement class="svg-icon" />
						</a>
					</div>
				</div>
			</div>
			<div class="divider"></div>
			<img @click="toggleModal" :src="loggedinUser.imgUrl" v-if="loggedinUser" class="profile" :title="loggedinUser.fullname" alt="Dor Toledano" />

			<div v-if="isModalOpen" class="modal" v-click-outside.stop="closeModal">
				<div @click.stop="doLogout" class="modal-container">
					<section class="wrapper" @click.stop="doLogout">
						<LogOut class="svg-icon" width="20px" height="20px" />
						<span> Logout</span>
					</section>
				</div>
			</div>

		</section>
		<FoldingSideBar  v-show="isMobile" class="mobile-folding-bar" /> 
		<FoldingSideBar class="desktop-folding-bar"/>
	</section>
</template>

<script>
import WorkManagement from '../assets/svg/WorkManagement.svg'
import Notifications from '../assets/svg/Notifications.svg'
import Inbox from '../assets/svg/Inbox.svg'
import MyWork from '../assets/svg/MyWork.svg'
import Favorite from '../assets/svg/Favorite.svg'
import Apps from '../assets/svg/Apps.svg'
import Invite from '../assets/svg/Invite.svg'
import Search from '../assets/svg/Search.svg'
import Help from '../assets/svg/Help.svg'
import InstalledProducts from '../assets/svg/InstalledProducts.svg'
import Divider from '../assets/svg/Divider.svg'
import FoldingSideBar from '../cmps/FoldingSidebar.vue'
import LogOut from '../assets/svg/LogOut.svg'

export default {
	props: {},
	created() {
		this.loggedinUser = this.$store.getters.loggedinUser
	},
	data() {
		return {
			isSelected: false,
			isModalOpen: false,
			isMobile:false
		}
	},
	methods: {
		toggleModal(){
			this.isModalOpen=!this.isModalOpen
		},
		closeModal(){
			this.isModalOpen=false
		},
		async doLogout(){
			try{
				console.log('Logging Out');
				await this.$store.dispatch({ type: 'logout' })
				this.$router.push(`/login`)
			}
			catch(err){
				console.log('Could not logout error:',err)
			}
		}
	},
	computed: {},
	components: {
		WorkManagement,
		Notifications,
		Inbox,
		MyWork,
		Favorite,
		Apps,
		Invite,
		Search,
		Help,
		InstalledProducts,
		Divider,
		FoldingSideBar,
		LogOut,
	},
}
</script>
