

<template>
  <div class="home pl-10 pr-10 pt-10 flex flex-col justify-start items-center">
    <h1 class="text-3xl text-blue-500">Projects</h1>
    <h2 v-show="error.length" class="text-red-500">{{ error }}</h2>

    <div class="flex w-3/4 pt-6 flex-wrap">
      <project-card
        v-for="project in me.projects"
        :key="project.id"
        :projectTitle="project.title"
        :projectId="project.id"
      >
      </project-card>
      <button
        id="addNewProjectButton"
        @click="openThing"
        class="pb-2 text-green-500"
      >
        <div>+</div>
        <div>Add New Project</div>
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
.home {
  height: fit-content;
  min-height: 90vh;
}

#addNewProjectButton {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding-left: 10px;
  box-sizing: border-box;
  height: 100px;
  width: 150px;
  margin: 10px 10px;
  background: linear-gradient(145deg, #fdffff, #d4d7e0);
  box-shadow: 8px 8px 16px #b6b8c0, -8px -8px 16px #ffffff;
  border-radius: 10%;
}

#addNewProjectButton:hover {
  background: linear-gradient(145deg, #d4d7e0, #fdffff);
  box-shadow: 8px 8px 16px #b6b8c0, -8px -8px 16px #ffffff;
}
</style>
