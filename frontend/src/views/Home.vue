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

				<!-- <router-link :to="'/board/642343ac91a1131b61553fef/main-table'">  -->

				<button @click="guestLogin">Guest</button>
				<router-link to="#">
					<button class="cta-btn">
						<span>Get started</span>
						<span>→</span>
					</button>
				</router-link>
			</nav>
		</header>

		<section class="body">
			<link
				href="https://fonts.googleapis.com/css?family=Lato:300,400,700"
				rel="stylesheet"
				type="text/css"
			/>
			<div id="stars"></div>
			<div id="stars2"></div>
			<div id="stars3"></div>
			<div id="title">
				<div>
					<span>A platform built for a new way of working</span>
					<br />
					<span> What would you like to manage with Funday today? </span>
				</div>
				<nav>
					<router-link :to="'/board/642343ac91a1131b61553fef/main-table'">
						<button class="cta-btn big">
							<span>Get started</span>
							<span>→</span>
						</button>
					</router-link>
				</nav>
			</div>
		</section>
	</section>
</template>

<script>
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
			this.$store.dispatch({ type: 'guestLogin' })
		},
	},
}
</script>
