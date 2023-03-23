<template>
    <main class="folding-bar">
        <div class="workspace">
            <span class="workspace-title flex ">Workspace
                <Menu class="svg-icon" />
            </span>
            <p class="main-workspace-title">Main workspace</p>
            <div class="btns flex column">
                <button @click="addBoard">
                    <Add class="svg-icon" /> <span class="optn" >Add</span>
                </button>
                <button>
                    <Filter class="svg-icon" /> <span class="optn">Filters</span>
                </button>
                <button>
                    <Search class="svg-icon" /> <span class="optn">Search</span>
                </button>
            </div>
        </div>

        <div class="spacer"></div>
        <BoardList :boardList="boardList"/>
    </main>
</template>

<script>
import Menu from '../assets/svg/Menu.svg'
import Add from '../assets/svg/Add.svg'
import Filter from '../assets/svg/Filter.svg'
import Search from '../assets/svg/Search.svg'
import Board from '../assets/svg/Board.svg'
import BoardList from './BoardList.vue'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service'


export default {
    props: {},
    created() {
      
    },
    data() {
        return {
        
        }
    },
    methods: {
        async addBoard(){ 
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
        boardList(){
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
    },
}
</script>
