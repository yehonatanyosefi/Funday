<template>
    <main class="folding-bar">
        <div class="workspace">
            <span class="workspace-title flex ">Workspace <Menu class="svg-icon" /></span>
            <p class="main-workspace-title">Main workspace</p>
            <div class="btns flex column">
                <button> <Add class="svg-icon" />  <span class="optn">Add</span> </button>
                <button><Filter class="svg-icon" />  <span class="optn">Filters</span></button>
                <button><Search class="svg-icon" /> <span class="optn">Search</span></button>
            </div>
        </div>

        <div class="spacer"></div>
        <div class="boards">
            <div class="board-link">
                <Board class="svg-icon" />
                <span>Dev</span> 
            </div>
            <div class="board-link"><Board class="svg-icon" /> <span>Finances</span> </div>
            <div class="board-link"><Board class="svg-icon" /> <span>Sales & Marketing</span> </div>

        </div>
    </main>
</template>

<script>
import Menu from '../assets/svg/Menu.svg'
import Add from '../assets/svg/Add.svg'
import Filter from '../assets/svg/Filter.svg'
import Search from '../assets/svg/Search.svg'
import Board from '../assets/svg/Board.svg'

export default {
    props: {},
    created() {

    },
    data() {
        return {

        }
    },
    methods: {

    },
    computed: {

    },
    components: {
        Menu,
        Add,
        Filter,
        Search,
        Board
    },
}
</script>
