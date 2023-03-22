<template>
<<<<<<< HEAD
<div class="status" :class="statusClass">
     {{info}}
     <!-- <div class="folding-corner"><div class="fold"></div></div> -->
=======
<div v-if="info">
     {{info}}
>>>>>>> c2d9ec4 (added dynamic components, with dynamic data from json)
</div>
<div v-else>No Status Available</div>
</template>

<script>
export default {
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
