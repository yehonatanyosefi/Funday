<template>
<section class="board-group">
      <!-- <section class="task-labels" v-for="(cmp, idx) in cmpOrder" :key="idx">
        <component :is="cmp" :info="task[cmp]"></component>
      </section> -->
    <section class="group" v-for="task in group.tasks" :key="task.id">
          <TaskPreview :task="task" :cmpOrder="cmpOrder"></TaskPreview>
    </section>
</section>
</template>

<script>
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
