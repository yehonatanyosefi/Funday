<template>
<div v-if="info">
     {{info}}
</div>
<div v-else>No Status Available</div>
</template>

<script>
export default {
     name: 'Status',
props: {
     info: String,
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
