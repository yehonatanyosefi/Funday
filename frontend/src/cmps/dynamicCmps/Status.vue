<template>
<div class="status" :class="statusClass">
     {{info}}
     <!-- <div class="folding-corner"><div class="fold"></div></div> -->
</div>
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
