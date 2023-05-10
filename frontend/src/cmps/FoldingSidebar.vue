<template>
    <main class="folding-bar" @click="onBlur" :class="{ folded: isFolded }">

        <div class="slide-btn" @click.stop="foldBar">
            <LeftArrow class="svg-icon" />
        </div>

        <div>

            <div class="workspace">
                <span class="workspace-title flex ">Workspace
                    <Menu class="svg-icon" />
                </span>
                <p class="main-workspace-title">
                    <img src="../assets/M-home.png" alt="">
                <div class="title">Main workspace</div>
                </p>
                <div class="btns flex column">
                    <button class="add-btn" @click.stop="addBoard">
                        <Add class="svg-icon" /> <span class="optn">Add</span>
                    </button>
                    <button class="ai-btn" @click="openGPT">
                        <Ai class="svg-icon ai" width="19px" height="19px" />
                        <span class="optn">Add board with AI</span>

                        <div v-if="isOpenAiModal" class="modal" v-click-outside="closeModal" @keydown.space.prevent="addSpace" >
                            <form @submit.prevent="sendGpt">
                                <div class="flex input-container">
                                    <label for="boardName">
                                        <input v-model="aiBoardName" id="boardName" placeholder="Enter board theme" required />
                                    </label>
                                </div>
                                <button class="flex send-btn">Make with AI</button>
                            </form>
                        </div>
                    </button>
                    <div class="searching" @click.stop="isSearching = true">
                        <button>
                            <Search class="svg-icon" /> <span class="optn" v-if="!isSearching">Search</span>
                            <input v-focus v-else v-model="filterBy.txt" type="search" placeholder="Search" @input="search" required>
                        </button>

                    </div>
                </div>
            </div>

            <div class="spacer"></div>
            <BoardList />
        </div>
    </main>
</template>

<script>
import Menu from '../assets/svg/Menu.svg'
import Add from '../assets/svg/Add.svg'
import Filter from '../assets/svg/Filter.svg'
import Ai from '../assets/svg/Ai.svg'
import Search from '../assets/svg/Search.svg'
import Board from '../assets/svg/Board.svg'
import BoardList from './BoardList.vue'
import LeftArrow from '../assets/svg/LeftArrow.svg'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service'

export default {
    created() {

    },
    data() {
        return {
            isSearching: false,
            filterBy: { txt: '' },
            isFolded: true,
            isHoverOpen: false,
            btnHover: false,
            isOpenAiModal: false,
            aiBoardName: '',
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
        },
        async search() {
            try {
                await this.$store.dispatch({ type: 'loadBoardList', filterBy: this.filterBy })
            }
            catch {
                throw new Error('Could not search')
            }
        },
        onBlur() {
            this.isSearching = false
            this.filterBy.txt = ''
            this.search()
        },
        foldBar() {
            this.isFolded = !this.isFolded
            this.isHoverOpen = false
        },
        mouseOverUnfold() {
            if (!this.btnHover) {
                this.isHoverOpen = true
                this.isFolded = false
            }


        },
        mouseOutFold() {
            if (this.isFolded || this.btnHover) return
            else {
                this.isHoverOpen = false
                this.isFolded = true
            }

        },
        async sendGpt() {
            try{
                if (!this.aiBoardName) return
                this.isOpenAiModal = false
                this.$store.dispatch({ type: 'addGptBoard', boardName: this.aiBoardName })
                this.aiBoardName = ''
            } catch (err){
                console.log('Cannot currently add board with AI', err)
            }
        },
        async openGPT() {
            this.isOpenAiModal = true
        },
        closeModal() {
			this.isOpenAiModal = false
		},
        addSpace(){
            this.aiBoardName+= ' '
        }

    },
    computed: {
        boardList() {
            return this.$store.getters.boardList
        }
    },
    components: {
        Menu,
        Add,
        Filter,
        Search,
        Board,
        BoardList,
        LeftArrow,
        Ai,
    },
    directives: {
        focus: {
            mounted(el) {
                el.focus()
            }
        }
    }
}
</script>
