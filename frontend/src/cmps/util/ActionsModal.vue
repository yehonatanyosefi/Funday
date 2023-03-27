<template>
<div class="checkbox-actions">
     <div class="num-of-actions">
          {{numOfActions}}
     </div>
     <div class="num-of-actions-wrapper">
          <div class="title-of-actions">Task<span v-if="numOfActions>1">s</span> selected</div>
          <div class="num-of-tasks-colors">
               <div class="num-of-tasks-color"></div>
          </div>
     </div>
     <div class="action-item">
          <Duplicate></Duplicate>
          Duplicate
     </div>
     <div class="action-item">
          <Delete></Delete>
          Delete
     </div>
     <div class="exit-actions">
          X
     </div>
</div>
</template>

<script>
import Delete from '../../assets/svg/Delete.svg'
import Duplicate from '../../assets/svg/Duplicate.svg'
export default {
props: {
numOfActions: { type:Number, default:1 },

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

},
components: {
Delete,
Duplicate,
},
}
</script>
