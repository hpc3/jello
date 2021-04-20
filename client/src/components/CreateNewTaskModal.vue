<template>
  <div id="addNewTaskWrapper">
    <h2>This is cate modal</h2>
    <input type="text" v-model="taskName" :id="inputId" ref="newTaskInput" />
    <button @click="addNewTask">Add</button>
    <button @click="cancelNewTask">Cancel</button>
  </div>
</template>




<script>
export default {
  name: "CreateNewTaskModal",
  props: {
    listStatus: String,
  },
  data() {
    return {
      taskName: "",
    };
  },
  methods: {
    cancelNewTask: function () {
      this.taskName = "";
      this.$emit("cancel-new-task", true);
    },
    addNewTask: function () {
      let payload;

      const title = this.taskName;
      const id = Date.now();
      const status = this.listStatus;

      payload = {
        title,
        id,
        status,
      };
      console.log(payload);
      this.taskName = "";
      this.$emit("add-new-task", payload);
    },
    focusOnMount: function () {
      this.$refs.newTaskInput.focus();
    },
  },
  mounted() {
    this.focusOnMount();
  },
  computed: {
    inputId: function () {
      return this.listStatus + "Input";
    },
  },
};
</script>



<style scoped>
#addNewTaskWrapper {
  margin: 0 5px;
  border-radius: 10px;
  height: fit-content;
  background: white;
}
</style>