<template>
<div>
     {{formattedDate}}
</div>
</template>

<script>
export default {
     name: 'Date',  
props: {
     info: Number,
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
     formattedDate() {
          const date = new Date(this.info)
          const day = date.getDate()
          const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
          const month = monthNames[date.getMonth()]
          return `${month} ${day}`
     }
},
components: {

},
}
</script>
