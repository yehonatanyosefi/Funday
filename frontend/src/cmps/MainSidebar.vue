<template>
	<section class="side-bars">
		<section class="sidebar">
			<div class="logo-img">
				<router-link :to="'/'">
					<img src="../assets/funday.png" alt="" />
				</router-link>

			</div>
			<!-- <div class="monday-style-divider surface-divider bottom monday-style-divider--horizontal"></div> -->
			<div class="divider"></div>
			<!-- <div class="triangle"></div> -->
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

					<!-- <button @click="hey">
						<Notifications class="svg-icon" />
					</button>
					<button disabbled>
						<Inbox class="svg-icon" />
					</button>
					<button disabbled>
						<MyWork class="svg-icon" />
					</button>
					<button disabbled>
						<Favorite class="svg-icon" />
					</button> -->
				</div>
				<!-- <button disabbled>
					<Apps class="svg-icon" />
				</button>
				<button disabbled>
					<Invite class="svg-icon" />
				</button>
				<button disabbled>
					<Search class="svg-icon" />
				</button>
				<button disabbled>
					<Help class="svg-icon" />
				</button> -->
			</div>
			<div class="divider"></div>

			<button disabbled>
				<InstalledProducts class="svg-icon InstalledProducts" />
			</button>
			<!-- :src="loggedinUser.imgUrl" v-if="loggedinUser"-->
			<!-- src="https://files.monday.com/euc1/photos/41054538/thumb/41054538-user_photo_2023_03_18_19_59_31.png?1679169572" -->
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
			loggedinUpser: null,
			isModalOpen: false,
			isMobile:false
		}
	},
	computed: {
		// loggedinUser() {
		// 	return this.$store.getters.loggedinUser
		// },
	},
	methods: {
		hey() {
			this.loggedinUser = this.$store.getters.loggedinUser
			console.log('loggedinUser', this.loggedinUser)
			console.log(this.$store.getters.users)

		},
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
