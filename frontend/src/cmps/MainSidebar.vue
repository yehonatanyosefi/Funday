<template>
	<section class="side-bars">
		<section class="sidebar">
			<!-- <router-link :to="'/'"> -->
			<img src="../assets/funday.png" alt="" />
			<!-- </router-link> -->
			<!-- <div class="monday-style-divider surface-divider bottom monday-style-divider--horizontal"></div> -->
			<div class="divider"></div>
			<!-- <div class="triangle"></div> -->
			<div class="mid-icons flex column">
				<div class="inside-icons flex column">
					<div class="svg-wrapper selected">
						<div class="triangle"></div>

						<a role="button">
							<WorkManagement class="svg-icon" />
						</a>
					</div>

					<button disabbled>
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
					</button>
				</div>
				<button disabbled>
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
				</button>
			</div>
			<div class="divider"></div>

			<button disabbled>
				<InstalledProducts class="svg-icon InstalledProducts" />
			</button>
			<img
				src="https://files.monday.com/euc1/photos/41054538/thumb/41054538-user_photo_2023_03_18_19_59_31.png?1679169572"
				class="profile"
				title="Dor Toledano"
				alt="Dor Toledano"
			/>
		</section>
		<FoldingSideBar />
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

export default {
	props: {},
	created() {},
	data() {
		return {
			isSelected: false,
		}
	},
	methods: {},
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
	},
}
</script>
