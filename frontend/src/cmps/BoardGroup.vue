<template>
<section class="board-group">
  <div class="task-header">
      <section v-for="(cmp, idx) in cmpOrder" :key="idx">
          <div>{{Object.keys(cmp)[0]}} | </div>
      </section>
  </div>
    <section class="group" v-for="task in group.tasks" :key="task.id">
          <TaskPreview :task="task" :cmpOrder="cmpOrder"></TaskPreview>
    </section>
</section>
</template>

<script>
// import { Container, Draggable } from "vue3-smooth-dnd";
import TaskPreview from './TaskPreview.vue'
export default {
props: {
    group: Object,
    cmpOrder: Array,
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
     TaskPreview,
},
}
</script>
