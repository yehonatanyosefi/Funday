<template>
     <div class="status" :class="statusClass" @click="toggleModal" >
          {{ info }}
          <!-- <div class="folding-corner"><div class="fold"></div></div> -->
          <div class="modal" v-if="isOpen">
               <div class="modal-container">
                    <div class="working" @click="$emit('updateTask','Working on it')"><p>Working on it</p> </div>
                    <div class="done" @click="$emit('updateTask','Done')"><p>Done</p> </div>
                    <div class="stuck" @click="$emit('updateTask','Stuck')"><p>Stuck</p> </div>
                    <div class="empty" @click="$emit('updateTask','')"><p></p> </div>
                    <!-- <div class="empty-blue"><p></p></div> -->
               </div>
               <section class="edit-labels">
                    <p class="divider"></p> 
                    <button><Edit class="svg-icon" />Edit Labels</button>
               </section>
          </div>
     </div>
</template>

<script>
import Edit from '../../assets/svg/Edit.svg'

export default {
     emits: ['updateTask'],
     name: 'Status',
     props: {
          info: String,
     },
     created() {

     },
     data() {
          return {
               isOpen:false,
          }
     },
     methods: {
          toggleModal(){
               this.isOpen=!this.isOpen
          }
     },
     computed: {
          statusClass() {
               return {
                    'working': this.info === 'Working on it',
                    'done': this.info === 'Done',
                    'stuck': this.info === 'Stuck',
                    'empty': this.info === '',
               }
          }

     },
     components: {
          Edit
     },
}
</script>
