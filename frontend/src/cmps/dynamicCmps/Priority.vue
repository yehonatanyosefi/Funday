<template>
<div class="priority" :class="info">
     {{info}}
</div>
</template>

<script>
export default {
emits: ['updateTask'],
     name: 'Priority',
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
