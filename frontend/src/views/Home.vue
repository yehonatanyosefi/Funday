<template>
	<section class="container home">
		<header class="main-header">
			<div class="left-container">
				<a href="/">
					<img class="logo" src="/src/assets/funday.png" alt="" />
					<h1>Funday</h1>
				</a>
			</div>

			<nav class="right-container">
				<div class="login-signup-container">
					<router-link to="/login">
						<button class="login-btn" @click="showModal = true">Log in</button>
					</router-link>
				</div>

				<!-- <button @click="guestLogin">Guest</button> -->
				<router-link to="#" @click="guestLogin">
					<button class="cta-btn">
						<span>Get started</span>
						<span class="arrow-container">
							<RightArrow class="svg-icon" width="14px" height="10px" />
						</span>
					</button>
				</router-link>
			</nav>
		</header>

		<section class="body">
			<link href="https://fonts.googleapis.com/css?family=Lato:300,400,700" rel="stylesheet" type="text/css" />
			<div id="stars"></div>
			<div id="stars2"></div>
			<div id="stars3"></div>
			<div id="title">
				<div>
					<span>A platform built for a new way of working</span>
					<br />
					<span class="subtitle"> What would you like to <span class="manage-word ">manage <div class="underline">
							</div></span> with Funday today? </span>
				</div>
				<nav>
					<router-link to="#" @click="guestLogin">
						<button class="cta-btn big">
							<span>Get started</span>
							<span class="arrow-container">
								<RightArrow class="svg-icon" />
							</span>
						</button>
					</router-link>
				</nav>
				<el-carousel indicator-position="none" autoplay :interval="3000" type="card" height="200px">
					<el-carousel-item v-for="(imgUrl, idx) in imgs" :key="idx">
						<img :src=imgUrl>
					</el-carousel-item>
				</el-carousel>
			</div>

			
			<AboutUs />
		</section>
		
	</section>
</template>

<script>
import RightArrow from '../assets/svg/RightArrow.svg'
import AboutUs from '../cmps/util/AboutUs.vue'

export default {
	name: 'home',
	computed: {
		board() {
			return this.$store.getters.board
		},
		vw() {
			return window.innerWidth
		},
	},
	data() {
		return {
			signedIn: false,
			profile: null,
			login: null,
			videoBG: 'stars.mp4',
			imgs: ['https://res.cloudinary.com/dcwibf9o5/image/upload/v1680444407/xitoef7v2grrunqkm0hq.jpg',
					'https://res.cloudinary.com/dcwibf9o5/image/upload/v1680444428/orienza3omctjqagbmw7.jpg',
					'https://res.cloudinary.com/dcwibf9o5/image/upload/v1680447960/uhcq0vnlq5nyefce89nj.jpg']
					// 'https://res.cloudinary.com/dcwibf9o5/image/upload/v1680444443/l75bnwpjntvvfunetevp.jpg']
	
		}
	},
	methods: {
		callback(response) {
			// This callback will be triggered when the user selects or login to
			// his Google account from the popup
			const userData = decodeCredential(response.credential)
			// try {
			//     console.log(`userCreds:`, userCreds)
			//     // await this.$store.dispatch({ type: 'loginGoogle', userCreds })
			//     // this.$router.push('/board/' + this.board._id)
			//   }
			//   catch (err) {
			//     console.log('Something went wrong', err);
			//   }
		},
		async handleCredentialResponse(ev) {
			gapi.auth2.GoogleAuth.then((res) => console.log(res))
		},

		async guestLogin() {
			const boardList = this.$store.getters.boardList
			const firstBoardId = boardList[0]._id
			this.$router.push(`/board/${firstBoardId}/main-table`)

		},
	},
	components: {
		RightArrow,
		AboutUs
	}
}
</script>

