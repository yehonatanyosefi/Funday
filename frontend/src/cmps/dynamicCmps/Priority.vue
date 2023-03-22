<template>
<div class="priority" :class="info" @click="toggleModal" >
     {{info}}
     <div class="modal" v-if="isOpen">
                    <div class="modal-container">
                         <div class="Critical" @click="$emit('updateTask','Critical')"><p>Critical</p> </div>
                         <div class="High" @click="$emit('updateTask','High')"><p>High</p> </div>
                         <div class="Medium" @click="$emit('updateTask','Medium')"><p>Medium</p> </div>
                         <div class="Low" @click="$emit('updateTask','Low')"><p>Low</p> </div>
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
}
},
methods: {
     toggleModal(){
               this.isOpen=!this.isOpen
          }
},
computed: {
},
components: {

},
}
</script>
