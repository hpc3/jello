

<template>
  <div class="home">
    <h1>Projects</h1>
    <h2 v-show="error.length" class="text-red-500">{{ error }}</h2>

    <div id="project-wrapper">
      <project-card
        v-for="project in me.projects"
        :key="project.id"
        :projectTitle="project.title"
        :projectId="project.id"
      >
      </project-card>
      <button id="addNewProjectButton" @click="openThing">
        <div
          class="border-green-600 rounded-full border-2 flex flex-1 items-center justify-center text-5xl text-green-500"
          style="height: 10px; width: 10px"
        >
          +
        </div>
        <h1 class="flex-1">New Project</h1>
      </button>

      <create-new-project
        v-if="displayCreateNewProjectModal"
        @close-modal="displayCreateNewProjectModal = false"
        @added-new-project="addNewProject"
      />
    </div>
  </div>
</template>

<script>
import gql from "graphql-tag";
import ProjectCard from "../components/ProjectCard.vue";
import CreateNewProject from "../components/CreateNewProject.vue";

export default {
  components: {
    "project-card": ProjectCard,
    "create-new-project": CreateNewProject,
  },
  name: "Home",

  data() {
    return {
      displayCreateNewProjectModal: false,
      error: "",
    };
  },
  apollo: {
    me: {
      query: gql`
        query GetProjects($id: ID!) {
          me(id: $id) {
            username
            projects {
              id
              title
            }
          }
        }
      `,
      variables: {
        id: localStorage.getItem("jello-userID"),
      },
    },
  },
  methods: {
    openThing: function () {
      this.displayCreateNewProjectModal = true;
    },
    addNewProject: function (project) {
      this.me.projects.push(project);

      this.displayCreateNewProjectModal = false;
    },
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

#addNewProjectButton {
  display: flex;
  align-items: flex-end;
  box-sizing: border-box;
  height: 100px;
  width: 100px;
  border: 2px solid black;
}
</style>
