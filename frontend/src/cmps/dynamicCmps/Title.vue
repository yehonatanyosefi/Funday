<template>
<div class="task-title">
     <input type="text" v-model="title" name="task-title" @input="$emit('updateTask',title)">
</div>
</template>

<script>
export default {
     name: 'Title',
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
     },
     computed: {

     },
     components: {

     },
}
</script>
