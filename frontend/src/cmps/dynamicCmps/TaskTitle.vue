<template>
<div class="task-title">
     <input type="text" v-model="title" name="task-title" @input="$emit('updateTask',['TaskTitle',title])">
</div>
</template>

<script>
export default {
     name: 'TaskTitle',
props: {
     info: String,
},
emits: ['updateTask'],
created() {
     this.title = this.info
},
data() {
return {
     title: null,

}
},
methods: {
     updateText(ev) {
          this.$emit('updateText', ev.target.value)
     }
},
computed: {

},
components: {

},
}
</script>
