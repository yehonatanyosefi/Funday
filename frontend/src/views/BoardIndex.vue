<template>
  <main class="main-layout">
    <MainSidebar></MainSidebar>
    <BoardHeader></BoardHeader>
    <RouterView></RouterView>
  </main>
</template>

<script>
import MainSidebar from '../cmps/MainSidebar.vue'
import BoardHeader from '../cmps/BoardHeader.vue'
export default {
  props: {},
  created() {},
  data() {
    return {}
  },
  methods: {},
  computed: {},
  components: {
    MainSidebar,
    BoardHeader,
  },
}
</script>
