<template>
    <main>
        <ul v-for="board in boardList" class="boards">
            <li class="board-link"> 
                <Board class="svg-icon" />
                {{ board.title }}
                <Menu class="svg-icon small-menu" width="16 " height="16"/>
            </li>
        </ul>
    </main>
</template>

<script>
import Menu from '../assets/svg/Menu.svg'
import Board from '../assets/svg/Board.svg'

export default {
    name: BoardList,
    props: {boardList:Array},
    created() {

    },
    data() {
        return {

        }
    },
    methods: {
        async addBoard() {
            try {
                await this.$store.dispatch({ type: 'addBoard' })
                showSuccessMsg('Board added')
            }
            catch {
                showErrorMsg('Cannot save Board')
            }
        }
    },
    computed: {

    },
    components: {
        Menu,
        Board
    },
}
</script>
