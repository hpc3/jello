<template>
  <div id="projectPageContainer">
    <h2>Project Name: {{ this.$route.query.projectTitle }}</h2>
    <button @click="displayNewTaskStatus = !displayNewTaskStatus">
      Create New List
    </button>
    <input v-show="displayNewTaskStatus" id="addNewTaskInput" />
    <button v-show="displayNewTaskStatus" @click="createNewList">Submit</button>
    <div id="allTasksContainer">
      <task-list
        v-for="(taskType, index) in taskStatusTypes"
        :title="taskType"
        :key="index"
        :tasks="seperateTasks[taskType]"
        :taskStatusOptions="taskStatusTypes"
        @status-change="updateTaskStatus"
        @add-new-task="addNewTask"
      >
      </task-list>
    </div>
  </div>
</template>



<script>
import TaskList from "../components/TaskList.vue";

export default {
  components: { TaskList },
  name: "Project",
  data() {
    return {
      tasks:
        this.$route.query.projectTasks === undefined
          ? []
          : this.$route.query.projectTasks,
      taskStatusTypes:
        this.$route.query.projectTaskStatusTypes === undefined
          ? ["ToDo", "In Progress", "Completed"]
          : this.$route.query.projectTaskStatusTypes,
      displayNewTaskStatus: false,
    };
  },
  computed: {
    seperateTasks: function () {
      let objectOfTaskLists = {};

      if (this.tasks !== undefined) {
        this.tasks.forEach((task) => {
          const { status } = task;
          if (objectOfTaskLists[status] === undefined) {
            objectOfTaskLists[status] = [];
            objectOfTaskLists[status].push(task);
          } else {
            objectOfTaskLists[status].push(task);
          }
        });
      }

      return objectOfTaskLists;
    },
    typeOfTaskLists: function () {
      let arrayOfAllTaskTypes = [];

      if (this.tasks !== undefined) {
        this.tasks.forEach((task) => {
          arrayOfAllTaskTypes.push(task.status);
        });
      } else {
        return this.taskStatusTypes;
      }

      let uniqueTaskTypes = [...new Set(arrayOfAllTaskTypes)];

      return uniqueTaskTypes;
    },
  },

  methods: {
    updateTaskStatus: function (payload) {
      console.log("something");
      let found = this.tasks.find((task) => task.taskId === payload.taskId);
      found.status = payload.newStatus;
      console.log("pewpewpew");
    },
    createNewList: function () {
      let newTaskStatusString = document.getElementById("addNewTaskInput");
      this.taskStatusTypes.push(newTaskStatusString.value);
      newTaskStatusString.value = "";
      this.displayNewTaskStatus = false;
    },
    addNewTask: function (payload) {
      this.tasks.push(payload);
    },
  },
};
</script>


<style scoped>
#projectPageContainer {
  height: fit-content;
  min-height: 100vh;
}

#allTasksContainer {
  background: blue;
  min-width: 100vw;
  width: fit-content;
  height: 100vh;
  display: flex;
  overflow-x: scroll;
}
</style>



