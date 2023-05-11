<template>
	<div>
		<div class="black-screen" :class="{ show: darken }"></div>
		<section
			class="task-details-container"
			@mouseover="darken = true"
			@mouseout="darken = false"
			v-click-outside="close"
		>
			<span v-if="task" @click="close" class="close-modal-btn"><Close></Close></span>
			<h1 v-if="task" class="task-modal-title">{{ task.title }}</h1>
			<div v-if="task" class="modal-btns">
				<div @click="goTo('comments')" :class="{ selected: showComp === 'comments' }">
					<Home></Home>
					<button class="task-comments-btn">Updates</button>
				</div>
				<span>|</span>
				<div @click="goTo('activities')" :class="{ selected: showComp === 'activities' }">
					<span></span>
					<button>Activity Log</button>
				</div>
			</div>

			<section v-if="task && showComp === 'comments'" class="task-comments">
				<form @submit.prevent="addComment">
					<quill-editor
						ref="inputTxt"
						placeholder="Write an update..."
						class="comment-add-txt"
						theme="snow"
						contentType="text"
					/>
					<button class="add-comment-btn">Update</button>
				</form>
				<div
					v-if="task.comments"
					class="comment"
					v-for="(comment, idx) in task.comments"
					:key="comment.id"
				>
					<div class="comment-profile">
						<img v-if="comment.byMember.imgUrl" :src="comment.byMember.imgUrl" alt="" />
						<PersonRound v-else></PersonRound>
						<p>{{ comment.byMember.fullname }}</p>
					</div>

					<div class="comment-options">
						<p><Time></Time>{{ getFormattedTime(comment.createdAt) }}</p>
						<Delete @click="deleteComment(idx)"></Delete>
					</div>
					<div class="comment-content" v-html="comment.txt"></div>

					<div class="comment-reactions">
						<div v-if="comment.likes?.length" class="likes">
							<div class="liked-users" v-for="(user,idx) in comment.likes">
								<img :src="comment.likes.length<3?user.imgUrl:''" :title="user.fullname" />
							</div>
							<p>Liked by {{ comment.likes[0].fullname }} and {{ idx }} {{idx>1 ? 'others':'other'}}</p>
						</div>
					</div>

					<div class="comment-like" @click.stop.prevent="likeComment(idx)">
						<div>
							<LikeSolid v-if="likeByMe(comment)" :class="{ selected: likeByMe(comment) }"></LikeSolid>
							<LikeSvg v-else></LikeSvg>
							<button :class="{ selected: likeByMe(comment) }">Like</button>
						</div>
					</div>

					<div class="comment-reply">
						<div>
							<Replay></Replay>
							<button @click="reply()">Reply</button>
						</div>
					</div>
				</div>
			</section>
		</section>
	</div>
</template>
<script>
import Home from '../assets/svg/Home.svg'
import Close from '../assets/svg/Close.svg'
import PersonRound from '../assets/svg/PersonRound.svg'
import Time from '../assets/svg/Time.svg'
import Delete from '../assets/svg/Delete.svg'
import Show from '../assets/svg/Show.svg'
import LikeSvg from '../assets/svg/Like.svg'
import LikeSolid from '../assets/svg/LikeSolid.svg'
import Replay from '../assets/svg/Replay.svg'

import { utilService } from '../services/util.service'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service'
import { QuillEditor } from '@vueup/vue-quill'

export default {
	name: 'task-details',
	data() {
		return {
			commentToAdd: '',
			groupId: '',
			showComp: 'comments',
			imgUrls: [],
			imgToShow: '',
			isLoading: false,
			isDragover: false,
			darken: false,
		}
	},
	async created() {
		// await this.$store.dispatch({ type: 'loadUsers' })
		// socketService.on('task-saved', (savedTask) => {
		//   this.$store.commit({ type: 'saveTask', savedTask })
		//   this.loadTask()
		// })
		// this.showUpdates = true
		// this.loadTask()
	},
	computed: {
		board() {
			return this.$store.getters.board
		},
		loggedinUser() {
			return this.$store.getters.loggedinUser
		},
		users() {
			//return this.$store.getters.users
		},
		activities() {
			//   return this.$store.getters.activities
		},
		getUserActivities() {
			//   console.log(`this.activities:`, this.activities)
			//   const activities = this.activities.filter(
			//     (activity) => activity.taskId === this.task._id
			//   )
			//   return activities
		},
		task() {
			const { taskId } = this.$route.params
			const { boardId } = this.$route.params
			let task = null
			this.board.groups?.some(({ tasks, id }) => {
				return tasks.some((currTask) => {
					if (currTask.id === taskId) {
						task = JSON.parse(JSON.stringify(currTask))
						this.groupId = id
						return true
					}
				})
			})
			return task
		},
	},
	methods: {
		getFormattedTime(oldTimestamp = Date.now()) {
			return utilService.getTimeDifference(Date.now(), oldTimestamp)
		},
		goTo(dest) {
			switch (dest) {
				case 'comments':
					this.showComp = 'comments'
					break
				case 'files':
					this.showComp = 'files'
					break
				case 'activities':
					this.showComp = 'activities'
					break
			}
		},
		close() {
			let path = this.$route.path
			const prefix = '/board/' + this.board._id + '/'
			path = path.replace(prefix, '')
			const endIdx = path.indexOf('/')
			path = path.substring(0, endIdx)

			this.$router.push('/board/' + this.board._id + '/' + path)

			// this.$router.push('/board/' + this.board._id + '/main-table')
		},
		addComment() {
			const commentToAdd = this.$refs.inputTxt.getHTML()
			const comment = {
				txt: commentToAdd,
				taskId: this.task._id,
				createdAt: Date.now(),
				id: utilService.makeId(),
				byMember: this.loggedinUser,
			}
			const task = JSON.parse(JSON.stringify(this.task))
			if (!task.comments) task.comments = []
			task.comments.unshift(comment)
			if (!this.task.comments) this.task.comments = []
			this.task.comments.unshift(comment)
			// const payload = { boardId: this.board._id, task, groupId: this.groupId }
			const taskToSave = { attName: 'comments', attValue: task.comments, taskId: task.id }
			const payloadToSave = { task: taskToSave, groupId: this.groupId }
			this.saveTask(payloadToSave)
			this.$refs.inputTxt.setHTML('')
		},
		async saveTask(payload) {
			try {
				const payloadToSave = { ...payload, boardId: this.board._id }
				const request = {
					dispatch: () => this.$store.dispatch({ type: 'saveTask', payload: payloadToSave }),
				}
				await this.$store.dispatch('enqueueRequest', request)
				// showSuccessMsg('Task updated')
			} catch (err) {
				console.log(err)
				// showErrorMsg('Cannot update task')
			}
		},
		getUserImg(userId) {
			//   let user = this.users.find((user) => user._id === userId)
			//   return user.imgUrl
		},
		likeComment(commentIdx) {
			let task = JSON.parse(JSON.stringify(this.task))
			const loggedinUser = JSON.parse(JSON.stringify(this.loggedinUser))
			if (!task.comments[commentIdx].likes) {
				task.comments[commentIdx].likes = []
				this.task.comments[commentIdx].likes = []
			}
			const idx = task.comments[commentIdx].likes.findIndex(
				(userLike) => userLike._id === loggedinUser._id
			)
			if (idx !== -1) {
				task.comments[commentIdx].likes.splice(idx, 1)
				this.task.comments[commentIdx].likes.splice(idx, 1)
			} else {
				task.comments[commentIdx].likes.unshift(loggedinUser)
				this.task.comments[commentIdx].likes.unshift(loggedinUser)
			}

			const taskToSave = { attName: 'comments', attValue: task.comments, taskId: task.id }
			const payloadToSave = { task: taskToSave, groupId: this.groupId }
			this.saveTask(payloadToSave)
			// const payload = { boardId: this.board._id, task, groupId: this.groupId }
			// this.$store.dispatch({ type: 'saveTask', payload })
		},

		deleteComment(commentIdx) {
			let task = JSON.parse(JSON.stringify(this.task))
			if (task.comments[commentIdx].byMember._id === this.loggedinUser._id) {
				task.comments.splice(commentIdx, 1)
				this.task.comments.splice(commentIdx, 1)
				showSuccessMsg('Message successfully deleted!')
			} else {
				showErrorMsg('Sorry, only the message creator can delete it.')
			}

			const taskToSave = { attName: 'comments', attValue: task.comments, taskId: task.id }
			const payloadToSave = { task: taskToSave, groupId: this.groupId }
			this.saveTask(payloadToSave)
			// const payload = { boardId: this.board._id, task, groupId: this.groupId }
			// this.$store.dispatch({ type: 'saveTask', payload })
		},
		handleFile(ev) {
			//   let file
			//   if (ev.type === 'change') file = ev.target.files[0]
			//   else if (ev.type === 'drop') file = ev.dataTransfer.files[0]
			//   this.onUploadFile(file)
		},
		async onUploadFile(file) {
			//   this.isLoading = true
			//   this.isDragover = false
			//   const res = await uploadImg(file)
			//   this.saveImg(res.url)
			//   this.isLoading = false
		},
		saveImg(imgUrl) {
			//   this.imgUrls.push(imgUrl)
			//   if (!this.task.imgUrls) this.task.imgUrls = []
			//   this.task.imgUrls.unshift(imgUrl)
			//   const task = JSON.parse(JSON.stringify(this.task))
			//   const taskToSave = { task }
			//   this.$store.dispatch({ type: 'saveTask', taskToSave })
		},
		removeImg(imgIdx) {
			//   this.imgUrls.splice(imgIdx, 1)
			//   this.task.imgUrls.splice(imgIdx, 1)
			//   const task = JSON.parse(JSON.stringify(this.task))
			//   const taskToSave = { task }
			//   this.$store.dispatch({ type: 'saveTask', taskToSave })
		},
		reply() {
			this.$refs.inputTxt.focus()
		},
		likeByMe(comment) {
			const myId = this.loggedinUser._id
			const idx = comment.likes?.findIndex((like) => like._id === myId)
			return idx > -1
		},
	},
	components: {
		Home,
		Close,
		PersonRound,
		Time,
		Delete,
		Show,
		LikeSvg,
		LikeSolid,
		Replay,
		QuillEditor,
		// imgList,
		// activityCmp,
		// imgPreview,
	},
}
</script>
