<!-- <template>
  <div v-if="currBoardId === board._id" class="modal" v-click-outside.stop="closeModal" @click="deleteBoard(board._id)">
                            <div class="modal-container">
                                <section class="wrapper">
                                    <Delete class="svg-icon" />
                                    <span> Delete</span>
                                </section>
                            </div>
                        </div>
  
</template> -->

<!-- <script>
// import AddItemModal from './AddItemModal.vue'
export default {
  name: 'menu-modal',
  emits: ['closeModal', 'addTask', 'addGroup'],
  props: {
    cmp: {
      type: String,
      required: false,
    },
  },
  methods: {
    closeModal() {
      this.$emit('closeModal')
    },
    addGroup() {
   
      this.$emit('closeModal')
    },
    addTask() {
     
      this.$emit('closeModal')
    },
  },
  components: {
  
  },
}
</script> -->
