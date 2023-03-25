<template>
  <section class="AddItemModal">
    <div class="modal-group flex column align-center">
      <div class="modal-item" @click="$emit('duplicateTask')">
        <div class="item-title flex align-center">
          <Add></Add>
          <p class="title">Duplicate</p>
        </div>
      </div>
      <div class="modal-item flex align-center" @click="$emit('deleteTask')">
        <div class="item-title flex align-center">
          <Delete></Delete>
          <p class="title">Delete</p>
        </div>
      </div>
    </div>
  </section>
</template>
<script>
import Add from '../../assets/svg/Add.svg'
import Delete from '../../assets/svg/Delete.svg'
export default {
  name: 'AddItemModal',
  emits: ['duplicateTask','deleteTask'],
  components: {
     Delete,
     Add,
},
}
</script>
