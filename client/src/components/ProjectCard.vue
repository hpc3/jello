<template>
  <router-link
    :to="{
      name: 'Project',
      params: { id: projectId },
      query: { projectTasks, projectTitle, projectTaskStatusTypes },
    }"
  >
    <div>
      <h1>{{ projectTitle }}</h1>
      {{ projectId }}
    </div>
  </router-link>
</template>



<script>
export default {
  name: "ProjectCard",
  props: {
    projectTitle: {
      type: String,
      required: true,
    },
    projectId: {
      type: Number,
      required: true,
    },
    projectTasks: {
      type: Array,
      //   required: true,
    },
    projectTaskStatusTypes: {
      type: Array,
    },
  },
};
</script>




<style scoped>
div {
  display: flex;
  align-items: flex-end;
  padding-left: 10px;
  box-sizing: border-box;
  height: 100px;
  width: 100px;
  border: 2px solid black;
}

h1 {
  font-size: 10px;
}
</style>