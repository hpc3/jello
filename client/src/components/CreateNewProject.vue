<template>
  <div id="createNewProjectContainer" class="flex items-center justify-center">
    <div
      id="inputWrapper"
      class="h-64 w-64 p-5 bg-white rounded-md flex flex-col justify-around"
    >
      <h1 class="text-2xl text-blue-500">Add New Project</h1>
      <h2 class="text-red-500" v-show="error.length">{{ error }}</h2>
      <input
        id="newProjectInput"
        type="text"
        placeholder="Project Title"
        class="border-blue-300 border-4 pl-2 rounded-lg"
        v-model="title"
      />
      <div class="flex justify-around">
        <button
          class="w-20 self-center rounded-full text-blue-500 p-1 inputButtons"
          @click="submit"
        >
          Create</button
        ><button
          class="w-20 self-center rounded-full text-red-500 p-1 inputButtons"
          @click="closeModal"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
</template>



<script>
import gql from "graphql-tag";

export default {
  name: "CreateNewProject",
  data() {
    return {
      title: "",
      error: "",
    };
  },
  methods: {
    closeModal: function () {
      this.$emit("close-modal");
    },
    closeModalEventListener: function (e) {
      if (e.target.id === "createNewProjectContainer") {
        this.$emit("close-modal");
      }
    },
    closeOnOffClick: function () {
      window.addEventListener("click", this.closeModalEventListener);
    },
    submit: function () {
      this.error = "";
      if (this.title === "") {
        this.error = "Provide a project title";
        return;
      }

      const a2z = new RegExp("^[a-zA-Z]+$");

      if (!a2z.test(this.title)) {
        this.error = "Title can only contain letters";
        return;
      }

      this.error = "";

      this.$apollo
        .mutate({
          mutation: gql`
            mutation createNewProject($id: ID!, $title: String!) {
              createNewProject(id: $id, title: $title) {
                id
                title
                tasks {
                  description
                }
              }
            }
          `,
          variables: {
            id: localStorage.getItem("jello-userID"),
            title: this.title,
          },
        })
        .then((res) => {
          const newProject = res.data.createNewProject;
          this.$emit("added-new-project", newProject);
        })
        .catch((err) => {
          const errorMessage = err.message.split(": ")[1];

          this.error = errorMessage;
        });
    },
  },
  mounted() {
    this.closeOnOffClick();
    document.getElementById("newProjectInput").focus();
  },
  beforeDestroy() {
    window.removeEventListener("click", this.closeModalEventListener);
  },
};
</script>



<style scoped>
#createNewProjectContainer {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  z-index: 1;
  background: rgba(0, 0, 0, 0.8);
}

#inputWrapper {
  background: linear-gradient(145deg, #1e1e1e, #191919);
  box-shadow: 7px 7px 14px #0e0e0e, -7px -7px 14px #2a2a2a;
}

.inputButtons {
  background: linear-gradient(145deg, #1e1e1e, #191919);
  box-shadow: 7px 7px 14px #0e0e0e, -7px -7px 14px #2a2a2a;
}

.inputButtons:hover {
  background: #1c1c1c;
  box-shadow: inset 7px 7px 14px #0e0e0e, inset -7px -7px 14px #2a2a2a;
}
</style>