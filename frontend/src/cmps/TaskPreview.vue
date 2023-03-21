<template>
<section class="task-preview">
  <div v-for="(cmp, idx) in cmpOrder" :key="idx">
        <component :is="cmp" :info="task[cmp]"></component>
  </div>
</section>
</template>

<script>
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
