<template>
<section class="task-preview" v-if="cmpOrder?.length">
  <div class="task">
    <input
      type="checkbox"
      title="Delete Task"
      class="task-checkbox"
      v-model="isModalOpen"
      @click="openModal">
  </div>
  <div v-for="(cmp, idx) in cmpOrder" :key="idx" class="task">
        <component
          :is="capitalizeFirstLetter(cmp)"
          :info="task[cmp]"
          @saveTask="saveTask($event,cmp)"></component>
  </div>
  <RemoveModal
    v-if="isModalOpen"
    @closeModal="handleCloseModal"
    @removeTask="handleRemoveTask">Task</RemoveModal>
</section>
</template>

<script>
import RemoveModal from './util/RemoveModal.vue';
// import { Container, Draggable } from "vue3-smooth-dnd";
import Title from './dynamicCmps/Title.vue'
import Side from './dynamicCmps/Side.vue'
import Person from './dynamicCmps/Person.vue'
import Date from './dynamicCmps/Date.vue'
import Status from './dynamicCmps/Status.vue'
import Priority from './dynamicCmps/Priority.vue'
import Text from './dynamicCmps/Text.vue'
export default {
  emits: ["saveTask", "removeTask"],
props: {
    task: Object,
    cmpOrder: Array,
  },
  created() {

  },
  data() {
    return {
      isModalOpen: false,
    }
  },
  methods: {
    saveTask(payload, cmp) {
      const taskToSave = JSON.parse(JSON.stringify(this.task))
      taskToSave[cmp] = payload
      this.$emit('saveTask', taskToSave)
    },
    capitalizeFirstLetter(str) {
      return str.charAt(0).toUpperCase() + str.slice(1)
    },
    openModal() {
      this.isModalOpen = true
    },
    handleRemoveTask() {
      this.isModalOpen = false
      this.$emit('removeTask',this.task.id)
    },
    handleCloseModal() {
      this.isModalOpen = false
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
    RemoveModal,
  },
}
</script>
