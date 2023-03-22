<template>
<section class="board-group">
<<<<<<< HEAD
    <h2 class="group-header">{{group.title}}</h2>
  <div class="task-header">
      <section v-for="(cmp, idx) in cmpOrder" :key="idx">
          <div class="task">{{Object.keys(cmp)[0]}} </div>
=======
  <div class="task-header">
      <section v-for="(cmp, idx) in cmpOrder" :key="idx">
          <div>{{Object.keys(cmp)[0]}} | </div>
>>>>>>> c2d9ec4 (added dynamic components, with dynamic data from json)
      </section>
  </div>
    <section class="group" v-for="task in group.tasks" :key="task.id">
          <TaskPreview :task="task" :cmpOrder="cmpOrder"></TaskPreview>
    </section>
    <div>Add a task</div>
    <div>Progress bar?</div>
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
