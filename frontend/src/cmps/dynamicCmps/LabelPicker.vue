<template>
<div>
     <div class="modal-container">
          <div
               v-for="(label,idx) in labels"
               :key="idx"
               :class="Object.keys(label)[0]"
               @click="$emit('updateTask',Object.values(label)[0])">
               <p>{{Object.values(label)[0]}}</p>
          </div>
     </div>
     <!-- <section class="edit-labels">
          <p class="divider"></p> 
          <button><Edit class="svg-icon" />Edit Labels</button>
     </section> -->
      <!-- v-click-outside="closeModal" -->
</div>
</template>

<script>
import Edit from '../../assets/svg/Edit.svg'
export default {
     emits: ['updateTask','closeModal'],
props: {
     labels: Array,
},
created() {

},
data() {
return {
}
},
methods: {
     closeModal() {
          this.$emit('closeModal')
     },
},
computed: {

},
components: {
     Edit,
},
}
</script>
