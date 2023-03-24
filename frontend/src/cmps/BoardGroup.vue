<template>
<section class="board-group">

    <h2 class="group-header">
        <div class="menu-btn-container">
            <Menu class="svg-icon menu-btn" width="20" height="20" @click="toggleMenuModal" />
        </div>
        <input type="text"
            :style="{'color': groupColor}"
            v-model="groupTitle"
            @input="saveGroupTitle">
    </h2>
    <div class="task-header">
    <div class="group-preview-color" :style="{'backgroundColor': groupColor}"></div>
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
        
    <Container orientation="vertical"
        class="group"
        @drop="onTaskDrop($event)"
        :get-child-payload="getCardPayload('task.id')">
        <!-- :drop-placeholder="dropPlaceholderOptions" -->
      <Draggable v-for="(task,idx) in group.tasks" :key="task.id">
          <TaskPreview
            :task="task"
            :groupColor="groupColor"
            :cmpOrder="cmpOrder"
            @saveTask="$emit('saveTask',{task:$event,groupId:group.id})"
            @removeTask="$emit('removeTask',{taskId:$event,groupId:group.id})"></TaskPreview>
      </Draggable>
    </Container>
<section class="task-preview">
  <div class="task">
  <div class="task-preview-color last-task" 
      :style="{'backgroundColor': groupColor}"></div>
    <input
      type="checkbox"
      title="Delete Task"
      class="task-checkbox" disabled>
  </div>
  <div v-for="(cmp, idx) in cmpOrder" :key="idx" class="task">
        <input v-if="idx === 0" value="+ Add item" @focus="addTask">
  </div>
</section>
    
  <RemoveModal
    v-if="isModalOpen"
    @closeModal="handleCloseModal"
    @remove="handleRemoveGroup">group</RemoveModal>
</section>
</template>

<script>
import Menu from '../assets/svg/Menu.svg'
import RemoveModal from './util/RemoveModal.vue';
import { Container, Draggable } from "vue3-smooth-dnd";
import TaskPreview from './TaskPreview.vue'
import Title from './dynamicCmps/Title.vue'
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
    isMenuModalOpen: false,
    // dropPlaceholderOptions: {
    //     className: 'drop-preview',
    //     animationDuration: '150',
    //     showOnTop: true
    // }
}
},
methods: {
    capitalizeFirstLetter(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    },
    //         :class="isLastTask(idx, group.tasks.length)"
    // isLastTask(idx, length) {
    //     return idx === length - 1 ? 'last-task' : ''
    // },
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
    toggleMenuModal() {
        this.isMenuModalOpen = !this.isMenuModalOpen
    },
    getCardPayload(ev) {
        // console.log('getCardPayload',ev)
    },
    addTask() {
        this.$emit('addTask',this.group.id)
    },
    // onDragStart(name,{payload}) {
    //     console.log('onDragStart', payload)
    // },
    // onDragEnd(name,{payload}) {
    //     console.log('onDragEnd', payload)
    // },
},
computed: {
    groupColor() {
        return this.group.style.color
    },
},
components: {
     TaskPreview,
     Container,
     Draggable,
     RemoveModal,
     Menu,
     Title,
},
}
</script>
