<template>
<section class="task-preview" v-if="cmpOrder?.length">
  <div v-for="(cmp, idx) in cmpOrder" :key="idx" class="task">
        <component
          :is="capitalizeFirstLetter(cmp)"
          :info="task[cmp]"
          @updateTask="updateTask($event,cmp)"></component>
  </div>
</section>
</template>

<script>
// import { Container, Draggable } from "vue3-smooth-dnd";
import Title from "./dynamicCmps/Title.vue";
import Side from "./dynamicCmps/Side.vue";
import Person from "./dynamicCmps/Person.vue";
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
  updateTask(payload,cmp) {
    const taskToSave = JSON.parse(JSON.stringify(this.task))
    taskToSave[cmp] = payload
    this.$emit('updateTask', taskToSave)
  },
  capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1)
  },
},
computed: {
    // tasks() {
    //     return this.$store.getters.groups
    // },
},
components: {
     Title,
     Side,
     Person,
     Date,
     Status,
     Text,
     Priority,
},
}
</script>
