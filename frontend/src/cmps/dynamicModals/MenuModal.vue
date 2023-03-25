<template>
  <section
    @keydown.escape="closeModal"
    class="menu-modal"
    v-click-outside="closeModal"
  >
    <component :is="cmp" @addGroup="addGroup" @addTask="addTask" />
  </section>
</template>

<script>
import AddItemModal from './AddItemModal.vue'
import RenameDeleteModal from './RenameDeleteModal.vue'
export default {
  name: 'menu-modal',
  emits: ['closeModal', 'addTask', 'addGroup'],
  props: {
    cmp: {
      type: String,
      required: false,
    },
  },
  methods: {
    closeModal() {
      this.$emit('closeModal')
    },
    addGroup() {
      this.$emit('addGroup')
      this.$emit('closeModal')
    },
    addTask() {
      this.$emit('addTask')
      this.$emit('closeModal')
    },
  },
  components: {
    AddItemModal,
    RenameDeleteModal,
  },
}
</script>
