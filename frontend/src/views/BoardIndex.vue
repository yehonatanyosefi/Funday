<template>
	<main class="main-layout">
		<MainSidebar v-show="board?._id"></MainSidebar>
		<div :class="[view +'1', 'container']" v-if="board?._id && !isSwitchingBoards">
			<BoardHeader></BoardHeader>
			<RouterView></RouterView>
		</div>
		<Loader v-else />
	</main>
</template>

<script>
import MainSidebar from '../cmps/MainSidebar.vue'
import BoardHeader from '../cmps/BoardHeader.vue'
import { SOCKET_EMIT_SET_BOARD, SOCKET_EMIT_BOARD_MSG } from '../services/socket.service'
import Loader from '../cmps/util/Loader.vue'
export default {
	async created() {
		if (!this.$store.getters.boardList.length) await this.$store.dispatch({ type: 'loadBoardList' })
		const params = this.$route.params?.boardId
		await this.$store.dispatch({ type: 'getFirstBoard', params })
		this.onBoardChanged(params)
	},
	destroyed() {
		socketService.off(SOCKET_EMIT_BOARD_MSG, this.onBoardUpdate)
	},
	data() {
		return {
			view:'main-table'
		}
	},
	methods: {
		onBoardUpdate(data) {
			this.$store.dispatch({ type: 'setAndFilterBoard', board: data })
		},
		onBoardChanged(boardId) {
			socketService.emit(SOCKET_EMIT_SET_BOARD, boardId)
			socketService.on(SOCKET_EMIT_BOARD_MSG, this.onBoardUpdate)
		},
	},
	watch: {
		'$route.params': {
			handler() {
				const boardId = this.$route.params?.boardId
				if (!boardId) return
				this.onBoardChanged(boardId)
			},
		},
		'$route.href': {
			handler() {
				this.view = this.$route.href.split('/')[3]
			},
		},
	},
	computed: {
		board() {
			return this.$store.getters.board
		},
		isSwitchingBoards() {
			return this.$store.getters.isSwitchingBoards
		},
	},
	components: {
		MainSidebar,
		BoardHeader,
		Loader,
	},
}
</script>
