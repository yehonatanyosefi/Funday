<template>
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
			<div @click="goTo('files')" :class="{ selected: showComp === 'files' }">
				<span></span>
				<button>Files</button>
			</div>
			<span>|</span>
			<div @click="goTo('activities')" :class="{ selected: showComp === 'activities' }">
				<span></span>
				<button>Activity Log</button>
			</div>
		</div>

		<section v-if="task && showComp === 'comments'" class="task-comments">
			<form @submit.prevent="addComment">
				<textarea
					v-model="commentToAdd"
					type="text"
					placeholder="Write an update..."
					class="comment-add-txt"
				/>
				<button class="add-comment-btn">Update</button>
			</form>
			<div v-if="task.comments" class="comment" v-for="comment in task.comments" :key="comment.id">
				<div class="comment-profile">
					<img v-if="comment.byMember.imgUrl" :src="comment.byMember.imgUrl" alt="" />
					<PersonRound v-else></PersonRound>
					<p>{{ comment.byMember.fullname }}</p>
				</div>

				<div class="comment-options">
					<Time></Time>
					<p>3h</p>
					<Menu></Menu>
				</div>
				<div class="comment-content">{{ comment.txt }}</div>

				<div class="comment-reactions">
					<!--<div v-if="comment.likes?.length" class="likes">
						<div class="liked-users" v-for="userId in comment.likes">
							<img :src="getUserImg(userId)" alt="" />
						</div>
						<p>Liked</p>
					</div> -->
					<div class="seen-count">
						<Show></Show>
						<p>1 Seen</p>
					</div>
				</div>
				<!-- </div> -->

				<div class="comment-like" @click.stop.prevent="likeComment(idx)">
					<div>
						<!-- <span v-if="comment?.likes?.includes(loggedinUser._id)"></span>-->
						<Like></Like>
						<button>Like</button>
					</div>
				</div>

				<div class="comment-reply">
					<div>
						<Replay></Replay>
						<button>Reply</button>
					</div>
				</div>
			</div>
		</section>

		<!-- <div
          v-if="!isLoading && !imgUrls.length"
          class="cta-container flex column center"
        >
          <div class="files-gallery-cmp flex column center">
            <img
              class="empty-state-image"
              src="https://cdn.monday.com/images/files-gallery/empty-state.png"
            />
            <div class="cta-container-title">
              <b>Drag &amp; drop</b>&nbsp;or&nbsp;<b>add files here</b>
            </div>
            <div class="cta-container-subtitle">
              Upload, comment and review all files in this item to easily
              collaborate in context
            </div>
            <button class="add-file-btn flex center">
              <input type="file" @change="handleFile" />
              <span v-svg-icon="'outlinePlus'"></span>
              <div>Add file</div>
            </button>
          </div>
        </div>

        <section v-if="imgUrls.length" class="img-gallery">
          <img-preview :imgUrls="imgUrls" @removeImg="removeImg" />
        </section>
      </section> -->
		<!-- </section>-->

		<section v-if="showComp === 'activities'" class="activity-log">
			<div class="activities-list">
				<div v-for="activity in getUserActivities" class="activity-item">
					<div class="created-time">
						<Time></Time>
						<p>{{ getFormattedTime(activity.createdAt) }}</p>
					</div>
					<div class="user">
						<img :src="activity.byUser.imgUrl" alt="" />
						<p>{{ task.title }}</p>
					</div>
					<activity-cmp :activity="activity" />
				</div>
			</div>
		</section>
	</section>
</template>
<script>
import Home from '../assets/svg/Home.svg'
import Close from '../assets/svg/Close.svg'
import PersonRound from '../assets/svg/PersonRound.svg'
import Time from '../assets/svg/Time.svg'
import Menu from '../assets/svg/Menu.svg'
import Show from '../assets/svg/Show.svg'
import Like from '../assets/svg/Like.svg'
import Replay from '../assets/svg/Replay.svg'

export default {
	name: 'task-details',
	data() {
		return {
			commentToAdd: '',
			task: null,
			showComp: 'comments',
			imgUrls: [],
			imgToShow: '',
			isLoading: false,
			isDragover: false,
			content: {
				icon: 'addComment',
				type: 'Comment',
			},
			darken: false,
		}
	},
	async created() {
		console.log('123')
		this.loadTask()
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
			//   return this.$store.getters.loggedinUser
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
	},
	methods: {
		getFormattedTime(oldTimestamp) {
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
			this.$router.push('/board/' + this.board._id + '/main-table')
		},
		addComment() {
			//   const comment = {
			//     txt: this.commentToAdd,
			//     taskId: this.task._id,
			//     createdAt: Date.now(),
			//     _id: utilService.makeId(),
			//     byMember: this.loggedinUser,
			//   }
			//   const task = JSON.parse(JSON.stringify(this.task))
			//   if (!task.comments) task.comments = []
			//   task.comments.unshift(comment)
			//   if (!this.task.comments) this.task.comments = []
			//   this.task.comments.unshift(comment)
			//   const taskToSave = { task }
			//   console.log(`taskToSave:`, taskToSave)
			//   this.$store.dispatch({ type: 'saveTask', taskToSave })
			//   this.commentToAdd = ''
		},
		getUserImg(userId) {
			//   let user = this.users.find((user) => user._id === userId)
			//   return user.imgUrl
		},
		likeComment(commentIdx) {
			//   const task = JSON.parse(JSON.stringify(this.task))
			//   const loggedinUserId = this.loggedinUser._id
			//   if (!task.comments[commentIdx].likes) {
			//     task.comments[commentIdx].likes = []
			//   }
			//   const idx = task.comments[commentIdx].likes.findIndex(
			//     (likeId) => likeId === loggedinUserId
			//   )
			//   if (idx !== -1) task.comments[commentIdx].likes.splice(idx, 1)
			//   else task.comments[commentIdx].likes.unshift(loggedinUserId)
			//   this.task = task
			//   const taskToSave = { task }
			//   this.$store.dispatch({ type: 'saveTask', taskToSave })
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
		async loadTask() {
			const { taskId } = this.$route.params
			const { boardId } = this.$route.params
			// if (this.board) {
			//   await this.$store.dispatch({ type: 'queryBoard', filter: { id } })
			// }
			this.board.groups.some(({ tasks }) =>
				tasks.some((currTask) => {
					if (currTask.id === taskId) {
						this.task = JSON.parse(JSON.stringify(currTask))
					}
				})
			)
			//   await this.$store.dispatch({ type: 'loadActivities' })
			//   if (this.task.imgUrls) this.imgUrls = this.task.imgUrls
			//   else this.imgUrls = []
		},
	},
	components: {
		Home,
		Close,
		PersonRound,
		Time,
		Menu,
		Show,
		Like,
		Replay,
		// imgList,
		// activityCmp,
		// imgPreview,
	},
}
</script>
