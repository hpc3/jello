<template>
  <div id="wrapper" class="flex flex-col justify-around items-center">
    <div
      style="all: inherit"
      v-show="!displayDeleteCheck && !displayEditTitle && !displayError"
    >
      <button
        @click="closeModal"
        class="self-start ml-4 h-3 hover:text-blue-400"
      >
        x
      </button>
      <button class="flex-1" @click="displayEditTitle = true">
        Edit Title
      </button>

      <button
        @click="displayDeleteCheck = true"
        class="flex-1 text-red-500 focus:outline-none"
      >
        Delete Project
      </button>
    </div>
    <div
      v-show="displayDeleteCheck && !displayError"
      class="w-full h-full flex flex-col justify-around"
      style="border-radius: 10%"
    >
      <h2 class="text-red-500">Are you sure?</h2>
      <div class="flex flex-row w-full justify-around">
        <button
          @click="deleteProject"
          class="deleteButtons w-11 h-7 rounded-3xl text-red-500 shadow-neumorButton focus:outline-none"
        >
          Yes</button
        ><button
          @click="displayDeleteCheck = false"
          class="deleteButtons w-11 h-7 rounded-3xl text-blue-500 shadow-neumorButton focus:outline-none"
        >
          No
        </button>
      </div>
    </div>
    <div v-show="displayEditTitle && !displayError">
      <input type="text" v-model="title" class="w-4/5 text-center" />

      <div>
        <button @click="verifyNewProjectTitle">Submit</button>
        <button @click="displayEditTitle = false">Cancel</button>
      </div>
    </div>

    <div v-show="displayError">
      <h1 class="underline" style="text-decoration-color: red">{{ error }}</h1>
      <button @click="displayError = false">Back</button>
    </div>
  </div>
</template>




<script>
import gql from "graphql-tag";

export default {
  name: "EditProject",
  props: {
    allProjectTitles: Array,
    projectTitle: String,
    projectId: String,
  },
  data() {
    return {
      displayDeleteCheck: false,
      displayEditTitle: false,
      displayError: false,
      title: null,
      error: null,
    };
  },
  methods: {
    closeModal: function () {
      this.$emit("close-modal");
    },
    verifyNewProjectTitle: function () {
      if (this.title === "") {
        // Set Error
        this.error = "Missing Title";
        // Revert adjusted title to original
        this.title = this.projectTitle;
        // Hide Edit
        this.displayEditTitle = false;
        // Display Error
        this.displayError = true;

        return;
      }

      const a2z = new RegExp("^[a-zA-Z ]+$");

      if (!a2z.test(this.title)) {
        // Set Error
        this.error = "Title can only contain letters";
        // Revert adjusted title to original
        this.title = this.projectTitle;
        // Hide Edit
        this.displayEditTitle = false;
        // Display Error
        this.displayError = true;
        return;
      }

      if (this.title === this.projectTitle) {
        // nothing has changed
        this.displayEditTitle = false;
        return;
      }

      this.displayEditTitle = false;

      this.$apollo
        .mutate({
          mutation: gql`
            mutation editProjectTitle(
              $userID: ID!
              $projectID: ID!
              $newTitle: String!
              $token: String!
            ) {
              editProjectTitle(
                userID: $userID
                projectID: $projectID
                newTitle: $newTitle
                token: $token
              )
            }
          `,
          variables: {
            userID: localStorage.getItem("jello-userID"),
            projectID: this.projectId,
            newTitle: this.title,
            token: localStorage.getItem("token"),
          },
        })
        .then((res) => {
          console.log(res.data.editProjectTitle);
          this.$emit("edit-project-title", {
            id: this.projectId,
            newTitle: this.title,
          });
          this.displayEditTitle = false;
        })
        .catch(() => {
          this.error = "Something went wrong";
          this.displayError = true;
        });
    },
    deleteProject: function () {
      // userID, projectID, token

      this.$apollo
        .mutate({
          mutation: gql`
            mutation deleteProject(
              $userID: ID!
              $projectID: ID!
              $token: String!
            ) {
              deleteProject(
                userID: $userID
                projectID: $projectID
                token: $token
              )
            }
          `,
          variables: {
            userID: localStorage.getItem("jello-userID"),
            projectID: this.projectId,
            token: localStorage.getItem("jello-token"),
          },
        })
        .then(() => {
          this.$emit("delete-project", this.projectId);
        })
        .catch(() => {
          this.error = "Something went wrong";
          this.displayError = true;
        });
    },
  },
  mounted() {
    this.title = this.projectTitle;
  },
};
</script>




<style scoped>
#wrapper {
  height: 100%;
  width: 100%;
  z-index: 1;
  background: linear-gradient(145deg, #fdffff, #d4d7e0);
  box-shadow: 8px 8px 16px #b6b8c0, -8px -8px 16px #ffffff;
  border-radius: 10%;
}

.shadowInset:hover {
  background: #eceff9;
  box-shadow: inset 20px 20px 60px #c9cbd4, inset -20px -20px 60px #ffffff;
}

.deleteButtons:hover {
  background: #eceff9;
  box-shadow: inset 20px 20px 60px #c9cbd4, inset -20px -20px 60px #ffffff;
}
</style>