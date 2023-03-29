<template>
     <div>
          <div class="triangle"></div>
          <div class="modal-container">
               <div v-for="(label, idx) in labels" :key="idx" :class="Object.keys(label)[0]"
                    @click="saveTask(Object.values(label)[0])">
                    <p>
                         <p class="label-name">{{ Object.values(label)[0] }}</p> 
                         <Alert v-if="Object.values(label)[0] === 'Critical'" class="svg-icon " height="15px" width="15px" ></Alert>
                    </p>
               </div>
          </div>
          <!-- <section class="edit-labels">
          <p class="divider"></p> 
          <button><Edit class="svg-icon" />Edit Labels</button>
     </section> -->
     </div>
</template>

<script>
import Edit from "../../assets/svg/Edit.svg";
import Alert from "../../assets/svg/Alert.svg";

export default {
  emits: ["saveTask", "closeModal"],
  props: {
    labels: Array,
  },
  created() {},
  data() {
    return {}
  },
  methods: {
    closeModal() {
      this.$emit("closeModal")
    },
    saveTask(payload) {
     this.closeModal()
     this.$emit("saveTask", payload)
    },
  },
  computed: {},
  components: {
    Edit,
    Alert,
  },
};
</script>
