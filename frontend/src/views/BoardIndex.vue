<template>
	<main class="main-layout">
		<MainSidebar></MainSidebar>
		<div class="container">
			<BoardHeader></BoardHeader>
			<RouterView></RouterView>
		</div>
	</main>
</template>

<script>
import MainSidebar from '../cmps/MainSidebar.vue'
import BoardHeader from '../cmps/BoardHeader.vue'
import { SOCKET_EMIT_SET_BOARD, SOCKET_EMIT_BOARD_MSG } from '../services/socket.service'
export default {
	props: {},
	async created() {
		const params = this.$route.params?.boardId
		if (!params) return
		await this.$store.dispatch({ type: 'getFirstBoard', params })
		this.onBoardChanged(params)
	},
	destroyed() {
		socketService.off(SOCKET_EMIT_BOARD_MSG, this.onBoardUpdate)
	},
	data() {
		return {}
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
	},
	computed: {},
	components: {
		MainSidebar,
		BoardHeader,
	},
}
</script>
