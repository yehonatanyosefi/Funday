<template>
<main>

<MainSidebar></MainSidebar>
<BoardHeader></BoardHeader>
<BoardDetails></BoardDetails>
</main>
</template>

<script>
import MainSidebar from '../cmps/MainSidebar.vue'
import BoardHeader from '../cmps/BoardHeader.vue'
import BoardDetails from '../cmps/BoardDetails.vue'
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
     MainSidebar,
     BoardHeader,
     BoardDetails,
},
}
</script>
