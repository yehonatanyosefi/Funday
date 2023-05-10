<template>
	<div class="login-signup" >
		
		<header>
			<div class="left-container">
				<router-link to="/">
					<img class="logo" src="/src/assets/funday.png" alt="" />
					<h1>Funday</h1>
				</router-link>
			</div>
		</header>

		<div class="login-area">
			<h1 class="login-header">{{ isSignin ? 'Welcome to Funday.com' : 'Log in to your account' }}</h1>

			<form v-if="isSignin" @submit.prevent="doSignup">
				<ImgUploader @uploaded="onUploaded" @isUploading="toggleIsUploading" />
				<h2>Set up your account</h2>
				<GoogleLoader v-if="isLoading"/>

				<input type="email" v-model="signupCred.username" placeholder="name@company.com"
					pattern="^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$" required />
				<label id="text" for="">
					Full name
					<input type="text" v-model="signupCred.fullname" placeholder="e.g. Jane Doe" required />
				</label>
				<label for="">
					Password
					<input type="password" v-model="signupCred.password" placeholder="Enter at least 8 characters"
						pattern=".{8,}" required />
				</label>
				<button>Signup</button>
				<div class="pre-signup">
					<span>Already have an account?</span><button @click="isSignin = !isSignin" type="button"
						class="pre-signup-btn">Log in</button>
				</div>
			</form>
			
			<form v-else @submit.prevent="doLogin">
				<GoogleLoader v-if="isLoading"/>
		
				<label id="mail-label" for="mail">
					Enter your work email address
					<input id="mail" type="email" v-model="loginCred.username" placeholder="Example@company.com"
						pattern="^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$" required />
				</label>

				<input type="password" v-model="loginCred.password" placeholder="Password" required />
				<button class="login-btn-container" :disabled="isLoading">
					<div class="login-btn">
						<p>Login</p>
						<Next class="svg-icon" />
					</div>
				</button>

				<p class="msg">{{ msg }}</p>

				<div class="pre-signup">
					<span>Don't have an account yet?</span>
					<button @click="isSignin = !isSignin" type="button"
						class="pre-signup-btn" :disabled="isUploading || isLoading">
						Sign up
					</button>
				</div>
			</form>
		</div>
	</div>
</template>

<script>
import ImgUploader from '../cmps/ImgUploader.vue'
import Next from '../assets/svg/Next.svg'
import GoogleLoader from '../cmps/util/GoogleLoader.vue'

export default {
	name: 'login-signup',
	data() {
		return {
			msg: '',
			loginCred: { username: '', password: '' },
			signupCred: { username: '', password: '', fullname: '', imgUrl: '' },
			isSignin: false,
			isUploading: false,
			isLoading:false
		}
	},
	computed: {
		users() {
			return this.$store.getters.users
		},
		loggedinUser() {
			return this.$store.getters.loggedinUser
		},
	},
	created() {
		this.loadUsers()
	},
	methods: {
		async doLogin() {
			if (!this.loginCred.username) {
				this.msg = 'Please enter username/password'
				return
			}
			try {
				this.isLoading=true
				const user = await this.$store.dispatch({ type: 'login', userCred: this.loginCred })
				this.isLoading=false
				if (!user) {
					this.msg = 'User not found'
					return
				}
				const firstBoard = await this.$store.dispatch({ type: 'getUserBoardList' })
				this.$router.push(`/board/${firstBoard._id}/main-table`)
			} catch (err) {
				this.isLoading=false
				console.log(err)
				this.msg = 'Incorrect username or password'
			}
		},
		doLogout() {
			this.$store.dispatch({ type: 'logout' })
		},
		async doSignup() {
			if (!this.signupCred.fullname || !this.signupCred.password || !this.signupCred.username) {
				this.msg = 'Please fill up the form'
				return
			}
			this.isLoading=true
			await this.$store.dispatch({ type: 'signup', userCred: this.signupCred })
			const firstBoard = await this.$store.dispatch({ type: 'getUserBoardList' })
			this.isLoading=false
			this.$router.push(`/board/${firstBoard._id}/main-table`)
		},
		loadUsers() {
			this.$store.dispatch({ type: 'loadUsers' })
		},
		async removeUser(userId) {
			try {
				await this.$store.dispatch({ type: 'removeUser', userId })
				this.msg = 'User removed'
			} catch (err) {
				this.msg = 'Failed to remove user'
			}
		},
		onUploaded(imgUrl) {
			this.isUploading = false
			this.signupCred.imgUrl = imgUrl
			console.log('imgUrl', imgUrl)

		},
		toggleIsUploading() {
			this.isUploading = true
		},
	},
	components: {
		ImgUploader,
		Next,
		GoogleLoader
	},
}
</script>
