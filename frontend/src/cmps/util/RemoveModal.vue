<template>
  <div class="remove-modal">
    <div class="remove-modal-overlay" @click="close"></div>
    <div class="remove-modal-content">
      <h3>Delete this <slot></slot>?</h3>
      <div class="remove-modal-buttons">
        <button @click="close" class="cancel-button">Cancel</button>
        <button @click="remove" class="delete-button">Delete</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    close() {
      this.$emit('close-modal')
    },
    remove() {
      this.$emit('remove')
    },
  },
}
</script>