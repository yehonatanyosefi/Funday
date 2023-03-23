<template>
<section class="board-group">
    <h2 class="group-header">{{group.title}}</h2>
    <div class="task-header">
        <section><div class="task">
            <input type="checkbox" class="task-checkbox" disabled>
        </div></section>
        <section v-for="(cmp, idx) in cmpOrder" :key="idx">
            <div v-if="cmp!=='title'" class="task">{{capitalizeFirstLetter(cmp)}}</div>
            <div v-else class="task">Task</div>
        </section>
    </div>
    <section class="group" v-for="(task,idx) in group.tasks" :key="task.id">
          <TaskPreview
            :task="task"
            :cmpOrder="cmpOrder"
            @saveTask="$emit('saveTask',{task:$event,groupId:group.id})"
            @removeTask="$emit('removeTask',{taskId:$event,groupId:group.id})"
            :class="isLastTask(idx, group.tasks.length)"></TaskPreview>
    </section>
    <!-- <div>Add a task</div> -->
    <!-- <div>Progress bar?</div> -->
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
    capitalizeFirstLetter(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    },
    isLastTask(idx, length) {
        return idx === length - 1 ? 'last-task' : ''
    },
},
computed: {

},
components: {
     TaskPreview,
},
}
</script>
