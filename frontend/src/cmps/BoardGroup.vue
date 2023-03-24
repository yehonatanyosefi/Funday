<template>
<section class="board-group">
    <h2 class="group-header">
        <input type="text"
        v-model="groupTitle"
        @input="saveGroupTitle">
    </h2>
    <div class="task-header">
        <section>
            <input
                type="checkbox"
                title="Delete Task"
                class="task-checkbox"
                v-model="isModalOpen"
                @click="openModal">
        </section>
        <section v-for="(cmp, idx) in cmpOrder" :key="idx">
            <div v-if="cmp!=='title'" class="task">{{capitalizeFirstLetter(cmp)}}</div>
            <div v-else class="task">Task</div>
        </section>
    </div>
        
    <!-- <section class="group" v-for="(task,idx) in group.tasks" :key="task.id"> -->
    <Container orientation="vertical"
        class="group"
        @drop="onTaskDrop($event)"
        :drop-placeholder="dropPlaceholderOptions"
        :get-child-payload="getCardPayload('task.id')">
        <!-- @drag-start="onDragStart('drag start', $event)"
        @drag-end="onDragEnd('drag end', $event)" -->
            <!-- drag-class="card-ghost"
            drop-class="card-ghost-drop" -->
      <Draggable v-for="(task,idx) in group.tasks" :key="task.id">
          <TaskPreview
            :task="task"
            :cmpOrder="cmpOrder"
            @saveTask="$emit('saveTask',{task:$event,groupId:group.id})"
            @removeTask="$emit('removeTask',{taskId:$event,groupId:group.id})"
            :class="isLastTask(idx, group.tasks.length)"></TaskPreview>
      </Draggable>
    </Container>
    <!-- <div>Add a task</div> -->
    <!-- <div>Progress bar?</div> -->
    
  <RemoveModal
    v-if="isModalOpen"
    @closeModal="handleCloseModal"
    @remove="handleRemoveGroup">group</RemoveModal>
</section>
</template>

<script>
import RemoveModal from './util/RemoveModal.vue';
import { Container, Draggable } from "vue3-smooth-dnd";
import TaskPreview from './TaskPreview.vue'
export default {
emits: ['saveTask', 'removeTask', 'saveGroup','removeGroup','applyTaskDrag'],
props: {
    group: Object,
    cmpOrder: Array,
},
created() {
    this.groupTitle = this.group.title
},
data() {
return {
    groupTitle: null,
    isModalOpen: false,
    //   upperDropPlaceholderOptions: {
    //     className: 'cards-drop-preview',
    //     animationDuration: '150',
    //     showOnTop: true
    //   },
      dropPlaceholderOptions: {
        className: 'drop-preview',
        animationDuration: '150',
        showOnTop: true
      }
}
},
methods: {
    capitalizeFirstLetter(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    },
    isLastTask(idx, length) {
        return idx === length - 1 ? 'last-task' : ''
    },
    saveGroupTitle() {
        const group = {...this.group, title: this.groupTitle}
        const payload = {group, groupId: group.id}
        this.$emit('saveGroup', payload)
    },
    removeGroup() {
        this.$emit('removeGroup', this.group.id)
    },
    openModal() {
      this.isModalOpen = true
    },
    handleRemoveGroup() {
      this.isModalOpen = false
      this.$emit('removeGroup',this.group.id)
    },
    handleCloseModal() {
      this.isModalOpen = false
    },
    onTaskDrop(dropPayload) {
        const {removedIndex, addedIndex} = dropPayload
        if (removedIndex === null && addedIndex === null) return
        const removedId = this.group.tasks.find((task,idx) => idx === removedIndex).id
        const addedId = this.group.tasks.find((task,idx) => idx === addedIndex).id
	    const payload = {removedId, addedId,groupId: this.group.id}
        this.$emit('applyTaskDrag',payload)
    },
    getCardPayload(ev) {
        // console.log('getCardPayload',ev)
    },
    // onDragStart(name,{payload}) {
    //     console.log('onDragStart', payload)
    // },
    // onDragEnd(name,{payload}) {
    //     console.log('onDragEnd', payload)
    // },
},
computed: {

},
components: {
     TaskPreview,
     Container,
     Draggable,
     RemoveModal,
},
}
</script>
