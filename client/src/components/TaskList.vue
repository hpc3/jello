<template>
  <div class="task-list-container">
    <h1>{{ title }}</h1>
    <task-card
      v-for="task in tasks"
      :key="task.taskId"
      :taskName="task.title"
      :taskStatus="task.status"
      :taskId="task.taskId"
      :taskStatusOptions="taskStatusOptions"
      v-on="$listeners"
    ></task-card>
    <create-new-task-modal
      v-if="displayAddNewTaskModal"
      :listStatus="title"
      @cancel-new-task="closeNewTaskModal"
      @add-new-task="closeNewTaskModal"
      v-on="$listeners"
    ></create-new-task-modal>
    <button @click="openNewTaskModal" v-else>
      Hey Clikc me to make new task
    </button>
  </div>
</template>



<script>
import CreateNewTaskModal from "./CreateNewTaskModal.vue";
import TaskCard from "./TaskCard.vue";

export default {
  components: { TaskCard, CreateNewTaskModal },
  name: "TaskList",
  props: {
    title: String,
    tasks: Array,
    taskStatusOptions: Array,
  },
  data() {
    return {
      displayAddNewTaskModal: false,
    };
  },
  methods: {
    closeNewTaskModal: function () {
      this.displayAddNewTaskModal = false;
    },
    openNewTaskModal: function () {
      this.displayAddNewTaskModal = true;
    },
  },
};
</script>

// Need to attach a listner onto submitting or canceling the new task to close the modal

<style scoped>
.task-list-container {
  height: fit-content;
  padding-bottom: 10px;
  width: 200px;
  background: lightgrey;
  margin: 0 50px;
}
</style>