<template>
  <div>
    <h1>{{ taskName }}</h1>

    <select name="TaskStatus" :value="taskStatus" @change="statusChange">
      <option
        v-for="(option, index) in taskStatusOptions"
        :value="option"
        :key="index"
      >
        {{ option }}
      </option>
      <!-- <option value="To-Do">To-Do</option>
      <option value="In Progress">In Progress</option>
      <option value="Completed">Completed</option> -->
    </select>
  </div>
</template>




<script>
export default {
  name: "TaskCard",
  props: {
    taskName: String,
    taskStatus: String,
    taskId: Number,
    taskStatusOptions: Array,
  },
  data() {
    return {
      status: this.taskStatus,
    };
  },
  methods: {
    statusChange: function (e) {
      const payload = {
        newStatus: e.target.value,
        taskId: this.taskId,
      };
      this.$emit("status-change", payload);
    },
  },
};
</script>

<style scoped>
div {
  margin: 0 5px;
  border-radius: 10px;
  height: fit-content;
  background: white;
}
</style>