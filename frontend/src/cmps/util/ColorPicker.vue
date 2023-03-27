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
    '#037f4c',
    '#9cd326',
    '#cab641',
    '#ffcb00',
    '#ff642e',
    '#ffadad',
    '#ff7575',
    '#bb3354',
    '#ff158a',
    '#faa1f1',
    '#a25ddc',
    '#784bd1',
    '#7e3b8a',
    '#401694',
    '#5559df',
    '#225091',
    '#579bfc',
    '#4eccc6',
    '#6cf',
    '#68a1bd',
    '#9aadbd',
    '#808080',
    '#333',
    '#7f5347',
    '#d974b0',
    '#ad967a',
    '#a1e3f6',
    '#bd816e',
    '#2b76e5',
    '#175a63',
    '#bda8f9',
    '#a9bee8',
    '#9d99b9',
    '#563e3e',
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
