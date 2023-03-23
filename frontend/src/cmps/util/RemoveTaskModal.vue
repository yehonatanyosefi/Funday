<template>
  <div class="remove-modal">
    <div class="remove-modal-overlay" @click="close"></div>
    <div class="remove-modal-content">
      <h3>Are you sure you want to delete this task?</h3>
      <div class="remove-modal-buttons">
        <button @click="remove" class="yes-button">Yes</button>
        <button @click="close" class="close-button">Close</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
  },
  methods: {
    close() {
      this.$emit('close-modal')
    },
    remove() {
      this.$emit('removeTask')
    },
  },
}
</script>