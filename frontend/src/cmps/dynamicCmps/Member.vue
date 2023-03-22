<template>
<div v-for="(id,idx) in info" :key="idx">
     {{id}}
</div>
</template>

<script>
export default {
     name: 'Member',
props: {
     info: Array,
},
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

},
}
</script>
