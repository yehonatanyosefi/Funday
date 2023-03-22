<template>
     <div class="status" :class="statusClass">
          {{ info }}
          <!-- <div class="folding-corner"><div class="fold"></div></div> -->
          <div class="modal-container">
               <div class="modal">
                    <div class="working"><p>Working on it</p> </div>
                    <div class="done"><p>Done</p> </div>
                    <div class="stuck"><p>Stuck</p> </div>
                    <div class="empty"><p></p> </div>
                    <div class="empty-blue"><p></p></div>
               </div>
               <div class="divider"></div>
          </div>
     </div>
     <div class="divider"></div>
</template>

<script>
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

          }
     },
     methods: {

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

     },
}
</script>
