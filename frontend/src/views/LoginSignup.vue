<template>
	<div class="login-signup">
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
				<!-- <label @drop.prevent="handleFile" @dragover.prevent>
          <img class="user-img" :src="signupCred.imgUrl" alt="">
          <input type="file" @change="handleFile" hidden>
        </label> -->

				<ImgUploader @uploaded="onUploaded" @isUploading="toggleIsUploading" />
				<h2>Set up your account</h2>
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
				<!-- <select v-model="loginCred.username">
            <option value="">Select User</option>
            <option v-for="user in users" :key="user._id" :value="user.username">{{ user.fullname }}</option>
          </select> -->
				<label id="mail-label" for="mail">
					Enter your work email address
					<input id="mail" type="email" v-model="loginCred.username" placeholder="Example@company.com" pattern="^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$" required />
				</label>

				<input type="password" v-model="loginCred.password" placeholder="Password" required />
				<button>
					<div class="login-btn">
						<p>Login</p>
						<Next class="svg-icon" />
					</div>
				</button>

				<div class="pre-signup">
					<span>Don't have an account yet?</span><button @click="isSignin = !isSignin" type="button"
						class="pre-signup-btn" :disabled="isUploading">
						Sign up
					</button>
				</div>
			</form>
		</div>
		<!-- <hr />
      <details>
        <summary>
          Admin Section
        </summary>
        <ul>
          <li v-for="user in users" :key="user._id">
            <pre>{{ user }}</pre>
            <button @click="removeUser(user._id)">x</button>
          </li>
        </ul>
      </details> -->
	</div>
</template>

<script>
import ImgUploader from '../cmps/ImgUploader.vue'
import Next from '../assets/svg/Next.svg'
// import { uploadService } from '../services/upload.service.js'

export default {
	name: 'login-signup',
	data() {
		return {
			msg: '',
			loginCred: { username: '', password: '' },
			signupCred: { username: '', password: '', fullname: '', imgUrl: '' },
			isSignin: false,
			isUploading: false,
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
				// console.log('this.loginCred',this.loginCred)
				const user = await this.$store.dispatch({ type: 'login', userCred: this.loginCred })
				if (!user) {
					this.msg = 'User not found'
					return
				}
				const firstBoard = await this.$store.dispatch({ type: 'getUserBoardList' })
				this.$router.push(`/board/${firstBoard._id}/main-table`)
			} catch (err) {
				console.log(err)
				this.msg = 'Failed to login'
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
			// console.log('this.signupCred',this.signupCred)
			await this.$store.dispatch({ type: 'signup', userCred: this.signupCred })
			const firstBoard = await this.$store.dispatch({ type: 'getUserBoardList' })
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
			// console.log('imgUrl',imgUrl)
			this.isUploading = false
			this.signupCred.imgUrl = imgUrl
			console.log('imgUrl', imgUrl)

		},
		toggleIsUploading() {
			this.isUploading = true
		},
		// async handleFile(ev) {
		//   const file = ev.type === 'change' ?
		//     ev.target.files[0] :
		//     ev.dataTransfer.files[0]
		//   const { imgUrl } = await uploadService.uploadImg(file)
		//   // this.item.imgUrl=imgUrl
		//   this.signupCred.imgUrl = imgUrl
		// }
	},
	components: {
		ImgUploader,
		Next,
	},
}
</script>
