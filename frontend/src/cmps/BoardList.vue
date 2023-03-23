<template>
    <main>
        <ul v-for="board in boardList" class="boards">
            <li class="board-link" @click="setBoard(board._id)"> 
                <Board class="svg-icon" />
                <span>{{ board.title }}</span> 
                <Menu class="svg-icon small-menu" width="16 " height="16"/>
            </li>
        </ul>
    </main>
</template>

<script>
import Menu from '../assets/svg/Menu.svg'
import Board from '../assets/svg/Board.svg'

export default {
    
    props: {
        boardList:Array
    }, //[{_id,title},{_id,title}]
    created() {

    },
    data() {
        return {

        }
    },
    methods: {
        setBoard(boardId){
            this.$store.dispatch({type:'getBoardById',boardId})
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
