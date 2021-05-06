<template>
  <router-link
    :to="{
      name: 'Project',
      params: { id: projectId },
    }"
  >
    <div class="pb-1">
      <h1 class="text-base pl-2">{{ projectTitle }}</h1>
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
      type: String,
      required: true,
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
  width: 150px;
  margin: 10px 10px;
  background: linear-gradient(145deg, #fdffff, #d4d7e0);
  box-shadow: 8px 8px 16px #b6b8c0, -8px -8px 16px #ffffff;

  border-radius: 10%;
}

div:hover {
  background: linear-gradient(145deg, #d4d7e0, #fdffff);
  box-shadow: 8px 8px 16px #b6b8c0, -8px -8px 16px #ffffff;
}

/* #E8E8E8#E8E8E8#E8E8E8 */
</style>