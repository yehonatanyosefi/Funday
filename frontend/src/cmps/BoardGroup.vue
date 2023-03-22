<template>
<section class="board-group">
    <h2 class="group-header">{{group.title}}</h2>
    <div class="task-header">
        <section v-for="(cmp, idx) in cmpOrder" :key="idx">
            <div class="task">{{capitalizeFirstLetter(cmp)}}</div>
        </section>
    </div>
    <section class="group" v-for="task in group.tasks" :key="task.id">
          <TaskPreview :task="task" :cmpOrder="cmpOrder" @updateTask="$emit('updateTask',{task:$event,groupId:group.id})"></TaskPreview>
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
    capitalizeFirstLetter(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    },
},
computed: {

},
components: {
     TaskPreview,
},
}
</script>
