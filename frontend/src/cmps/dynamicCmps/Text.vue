<template>
<div class="text">
    <input
      type="text"
      v-model="title"
      name="task-text"
      class="task-text-input"
      @input="$emit('updateTask', title)"
    />
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
