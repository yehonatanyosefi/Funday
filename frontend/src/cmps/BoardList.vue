<template>
	<main>
		<ul class="boards">
			<Container orientation="vertical" @drop="onBoardDrop($event)">
				<Draggable v-for="board in boardList" :key="board._id">
					<li
						class="board-link board-title"
						:class="{
							'selected-board': currBoardId === board._id,
							rename: editedBoardId === board._id && isRename,
						}"
						@click="setBoard(board._id)"
					>
						<Board class="svg-icon board-svg" height="19px" width="19px" />
						<span v-if="(isRename && editedBoardId !== board._id) || !isRename">{{ board.title }}</span>
						<form v-else @submit.prevent="renameBoard()">
							<input v-focus v-model="title" type="text" @click.stop />
						</form>
						<Menu
							class="svg-icon small-menu"
							width="16 "
							height="16"
							@click.stop="toggleModal(board._id)"
						/>

						<div
							v-if="isModalOpen && editedBoardId === board._id"
							class="modal"
							v-click-outside.stop="closeModal"
						>
							<div @click.stop="toggleRename(board._id)" class="modal-container">
								<section class="wrapper">
									<Edit class="svg-icon" width="20px" height="20px" />
									<span> Rename Board</span>
								</section>
							</div>
							<div @click="duplicateBoard" class="modal-container">
								<section class="wrapper">
									<Duplicate class="svg-icon" width="20px" height="20px" />
									<span>Duplicate</span>
								</section>
							</div>
							<div @click.stop="deleteBoard(board._id)" class="modal-container">
								<section class="wrapper">
									<Delete class="svg-icon" width="20px" height="20px" />
									<span> Delete</span>
								</section>
							</div>
						</div>
					</li>
				</Draggable>
			</Container>
		</ul>
	</main>
</template>

<script>
import Menu from '../assets/svg/Menu.svg'
import Delete from '../assets/svg/Delete.svg'
import Board from '../assets/svg/Board.svg'
import Edit from '../assets/svg/Edit.svg'
import Duplicate from '../assets/svg/Duplicate.svg'
import { Container, Draggable } from 'vue3-smooth-dnd'

export default {
	// props: {
	//     boardList: Array
	// }, //[{_id,title},{_id,title}]
	created() {},
	data() {
		return {
			editedBoardId: '',
			title: '',
			isRename: false,
			isModalOpen: false,
		}
	},

	methods: {
		setBoard(boardId) {
			this.$store.dispatch({ type: 'getBoardById', boardId })
		},
		async deleteBoard(boardId) {
			try {
				await this.$store.dispatch({ type: 'deleteBoard', boardId })
				this.closeModal()
				// this.currBoardId()
				// const boards = this.$store.getters.boardList
				// const length =this.$store.getters.boardList.length
				// const lastBoard = boards[length-1]
				const board = this.$store.getters.board
				this.$router.push(`/board/${board._id}/main-table`)
			} catch (err) {
				console.log('couldnt delete ', err)
			}
		},
		toggleRename(boardId) {
			this.title = this.boardList.find((listItem) => listItem._id === boardId).title
			this.isRename = true
			this.closeModal()
		},
		async renameBoard() {
			try {
				const payload = { val: this.title, type: 'title', newBoardId: this.editedBoardId }
				await this.$store.dispatch({ type: 'updateBoard', payload })
				this.isRename = false
			} catch {
				console.log(err)
			}
		},
		async duplicateBoard() {
			try {
				const board = await this.$store.dispatch({ type: 'getBoardById', boardId: this.editedBoardId })
				let duplicatedBoard = JSON.parse(JSON.stringify(board))
				delete duplicatedBoard._id
				duplicatedBoard.title = 'Copy ' + duplicatedBoard.title
				await this.$store.dispatch({ type: 'duplicateBoard', board: duplicatedBoard })
				this.closeModal()
			} catch (err) {
				console.log('Cannot duplicate board')
			}
		},
		toggleModal(boardId) {
			this.editedBoardId = boardId
			// this.currBoardId = this.currBoardId === boardId ? '' : boardId
			this.isModalOpen = true
		},
		closeModal() {
			this.isModalOpen = false
			// this.currBoardId = ''
		},
		onBoardDrop(dropPayload) {
			const { removedIndex, addedIndex } = dropPayload
			if ((removedIndex === null && addedIndex === null) || addedIndex === removedIndex) return
			const removedId = this.boardList.find((board, idx) => idx === removedIndex)._id
			const addedId = this.boardList.find((board, idx) => idx === addedIndex)._id
			const payload = { removedId, addedId }
			this.$store.dispatch({ type: 'applyBoardDrag', payload })
		},
	},
	computed: {
		currBoardId() {
			return this.$store.getters.board._id
		},
		boardList() {
			return this.$store.getters.boardList
		},
	},
	components: {
		Menu,
		Board,
		Delete,
		Edit,
		Duplicate,
		Container,
		Draggable,
	},
	directives: {
		focus: {
			mounted(el) {
				el.focus()
			},
		},
	},
}
</script>
