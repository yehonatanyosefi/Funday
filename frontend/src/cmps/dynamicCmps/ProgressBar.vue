<template>
<div class="progress-view flex align-center justify-center">
    <div
    class="progress-bar-segment"
    v-for="(color,idx) in colors"
    :key="idx"
    :title="title(idx)"
    :style="{ backgroundColor: colors[idx], width: widths[idx]+'px' }"></div>
    
</div>
</template>

<script>

export default {
name: 'ProgressBar',
props: {
     group: Object,
     progressObj: Object,
     cmp: String,
},
created() {
     this.words = this.progressObj[this.cmp].words
     this.colors = this.progressObj[this.cmp].colors
},
data() {
return {
     words: [],
     colors: [],
}
},
methods: {
     getProgress(name) {
          return this.group.tasks.filter(task => task[this.cmp] === name).length
     },
     calculateSingleWidth(name) {
          const total = this.group.tasks.length
          const done = this.getProgress(name)
          const doneWidth = (done / total) * 123
          return doneWidth
     },
     title(idx) {
          return Math.round(this.widths[idx]/123*100)+'% '+this.words[idx]
     },
},
computed: {
     widths() {
          return Object.values(this.words.map(word => this.calculateSingleWidth(word)))
     },
},
components: {

},
}
</script>
