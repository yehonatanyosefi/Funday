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
  async created() {
    const params = this.$route.params.boardId
		await this.$store.dispatch({ type: "getFirstBoard", params })
  },
  data() {
    return {
    }
  },
  methods: {},
  computed: {},
  components: {
    MainSidebar,
    BoardHeader,
  },
}
</script>
