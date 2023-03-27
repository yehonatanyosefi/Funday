<template>
<div class="text">
    <input
      type="text"
      v-model="title"
      name="task-text"
      class="board-input task-text-input"
      @input="$emit('saveTask', title)"
    />
</div>

</template>

<script>
export default {
     name: 'Text',
emits: ['saveTask'],
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
