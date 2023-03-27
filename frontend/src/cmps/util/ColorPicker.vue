<template>
     <div class="color-picker">
          <div v-for="color in colorPicker" @click.stop="chooseColor(color)" class="color-div" :style="'Background-color: '+color+';'"></div>
     </div>
</template>

<script>
export default {
     emits: ['chooseColor', 'closeColorPicker'],
props: {},
created() {

},
data() {
return {
     colorPicker: [
     '#037F4C',
     '#00C875',
     '#9CD326',
     '#CAB641',
     '#FFCB00',
     '#784BD1',
     '#A25DDC',
     '#0086C0',
     '#579BFC',
     '#66CCFF',
     '#BB3354',
     '#E2445C',
     '#FF5AC4',
     '#FF642E',
     '#FDAB3D',
     '#7F5347',
     '#C4C4C4',
     '#808080',
     ]


}
},
methods: {
          chooseColor(val) {
               this.$emit('chooseColor', val)
               this.$emit('closeColorPicker')
          },
          closeColorPicker() {
               this.$emit('closeColorPicker')
          },

},
computed: {

},
components: {

},
}
</script>
