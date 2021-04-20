<template>
  <div class="home">
    <h1>Projects</h1>
    <h1>{{ this.$route.path }}</h1>
    <div id="project-wrapper">
      <project-card
        v-for="project in projects"
        :key="project.id"
        :projectTitle="project.title"
        :projectId="project.id"
        :projectTasks="project.taskItems"
        :projectTaskStatusTypes="project.taskStatusTypes"
      >
      </project-card>
    </div>

    <!-- <HelloWorld  /> -->
  </div>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue'

import ProjectCard from "../components/ProjectCard.vue";

// console.log(this.data.$route);

export default {
  components: { "project-card": ProjectCard },
  name: "Home",
  props: {
    userData: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      projects: [
        {
          id: 0,
          title: "the-stand",
          taskItems: [
            { taskId: 0, status: "To-Do", title: "Fix Thing" },

            { taskId: 1, status: "In Progress", title: "Auth" },
            { taskId: 2, status: "Completed", title: "Other" },
            { taskId: 3, status: "To-Do", title: "Fix Other Thing" },
          ],
          taskStatusTypes: ["To-Do", "In Progress", "Completed"],
        },
        { id: 1, title: "portfolio" },
        { id: 2, title: "f-w" },
      ],
    };
  },
};
</script>

<style scoped>
#project-wrapper {
  display: flex;
}

li {
  list-style: none;
}
</style>
