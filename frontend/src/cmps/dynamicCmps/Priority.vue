<template>
<div class="priority" :class="info" @click="toggleModal" >
     {{info}}
     <LabelPicker
          v-if="isOpen"
          class="modal"
          :labels="labels"
          @updateTask="$emit('updateTask',$event)"
          @closeModal="closeModal"></LabelPicker>
</div>

</template>

<script>
import LabelPicker from './LabelPicker.vue'
export default {
emits: ['updateTask'],
     name: 'Priority',
props: {
     info: String,
},
created() {

},
data() {
return {
     isOpen:false,
     labels: [{Critical:'Critical'}, {High:'High'}, {Medium:'Medium'}, {Low:'Low'},{empty:''}],
}
},
methods: {
     toggleModal(){
               this.isOpen =! this.isOpen
     },
     openModal() {
          this.isOpen = true
     },
     closeModal() {
          this.isOpen = false
     },
},
computed: {
},
components: {
     LabelPicker,
},
}
</script>
