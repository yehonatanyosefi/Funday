<template>
<section class="task-preview" v-if="cmpOrder?.length">
  <div v-for="(cmp, idx) in cmpOrder" :key="idx" class="task">
        <component :is="Object.values(cmp)[0]" :info="task[Object.keys(cmp)[0]]" @updateTask="updateTask($event,cmp)"></component>
  </div>
</section>
</template>

<script>
// import { Container, Draggable } from "vue3-smooth-dnd";
import TaskTitle from "./dynamicCmps/TaskTitle.vue";
import Side from "./dynamicCmps/Side.vue";
import Member from "./dynamicCmps/Member.vue";
import Date from "./dynamicCmps/Date.vue";
import Status from "./dynamicCmps/Status.vue";
import Priority from "./dynamicCmps/Priority.vue";
import Text from "./dynamicCmps/Text.vue";
export default {
props: {
    task: Object,
    cmpOrder: Array,
},
created() {
},
data() {
return {
}
},
methods: {
  updateTask(ev,cmp) {
    console.log(`cmp:`, cmp)
    console.log(`ev:`,ev)
  }
},
computed: {
    // tasks() {
    //     return this.$store.getters.groups
    // },
},
components: {
     TaskTitle,
     Side,
     Member,
     Date,
     Status,
     Text,
     Priority,
},
}
</script>
