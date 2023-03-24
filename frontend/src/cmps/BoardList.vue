<template>
    <main>
        <!-- <ul v-for="board in boardList" class="boards" :key="board._id">
            <li class="board-link board-title" @click="setBoard(board._id)">
                <Board class="svg-icon" />
                <span>{{ board.title }}</span>
                <Menu class="svg-icon small-menu" width="16 " height="16" @click="toggleModal(board._id)" />

                <div class="modal" v-if="currBoardId === board._id" @click="deleteBoard(board._id)">
                    <div class="modal-container">
                        <section class="wrapper">
                            <Delete class="svg-icon" />
                            <span> Delete</span>
                        </section>
                    </div>
                </div>

            </li>
        </ul> -->
        <ul class="boards">
            <Container orientation="vertical" @drop="onBoardDrop($event)">
                <Draggable v-for="board in boardList"  :key="board._id">
                    <li class="board-link board-title" @click="setBoard(board._id)">
                        <Board class="svg-icon" />
                        <span>{{ board.title }}</span>
                        <Menu class="svg-icon small-menu" width="16 " height="16" @click.stop="toggleModal(board._id)" />

                        <div v-if="currBoardId === board._id" class="modal" v-click-outside.stop="closeModal" >
                            <div @click="renameBoard(board._id)" class="modal-container">
                                <section class="wrapper">
                                    <Edit class="svg-icon" />
                                    <span> Rename</span>
                                </section>
                            </div>
                            <div @click="duplicateBoard(board._id)" class="modal-container">
                                <section class="wrapper">
                                    <Duplicate class="svg-icon" />
                                    <span>Duplicate</span>
                                </section>
                            </div>
                            <div @click="deleteBoard(board._id)" class="modal-container">
                                <section class="wrapper">
                                    <Delete class="svg-icon" />
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

    props: {
        boardList: Array
    }, //[{_id,title},{_id,title}]
    created() {

    },
    data() {
        return {
            isOpen: false,
            currBoardId: '',

        }
    },
    methods: {
        setBoard(boardId) {
            this.$store.dispatch({ type: 'getBoardById', boardId })
        },
        deleteBoard(boardId) {
            this.$store.dispatch({ type: 'deleteBoard', boardId })
            this.currBoardId = ''
        },
        toggleModal(boardId) {
            this.currBoardId = this.currBoardId === boardId ? '' : boardId
        },
        openModal() {
            this.isOpen = true
        },
        closeModal() {
            this.currBoardId=''
            // this.isOpen = false
        },
        onBoardDrop(dropPayload) {
            const { removedIndex, addedIndex } = dropPayload
            if (removedIndex === null && addedIndex === null) return
            const removedId = this.boardList.find((board, idx) => idx === removedIndex)._id
            const addedId = this.boardList.find((board, idx) => idx === addedIndex)._id
            const payload = { removedId, addedId }
            this.$store.dispatch({ type: 'applyBoardDrag', payload })
        },
    },
    computed: {
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
}
</script>
