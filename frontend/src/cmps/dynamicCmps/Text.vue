<template>
<div class="text">
     <!-- <input type="text" :value="info" name="text"> -->
     {{info}}
</div>

</template>

<script>
export default {
     name: 'Text',
emits: ['updateTask'],
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
