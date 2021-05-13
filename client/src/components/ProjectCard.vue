<template>
  <!-- flip card -->

  <div class="flipCard">
    <div class="flip-inner" :class="{ flipTransform: displayEditModal }">
      <router-link
        :to="{
          name: 'Project',
          params: { id: projectId },
        }"
        :disabled="hoverEdit && displayEditModal"
        :event="!hoverEdit && !displayEditModal ? 'click' : ''"
        class="pb-1 flex flex-col justify-between px-2 projectCardWrapper hover flip-front"
        :class="{ hoverClass: !hoverEdit }"
      >
        <button
          class="text-base font-bold h-6 w-6 hover:text-blue-400 z-10 focus:outline-none"
          @mouseenter="enterEdit"
          @mouseleave="hoverEdit = false"
          @click="displayEditModal = !displayEditModal"
        >
          <p
            class="expandTransition"
            :class="{ expand: hoverEdit, hide: displayEditModal }"
          >
            ...
          </p>
        </button>

        <h1 class="text-base pl-2 self-start">{{ projectTitle }}</h1>
      </router-link>
      <div class="flip-back">
        <edit-project
          v-show="displayEditModal"
          :allProjectTitles="allProjectTitles"
          :projectTitle="projectTitle"
          :projectId="projectId"
          @close-modal="displayEditModal = false"
          v-on="$listeners"
        />
      </div>
    </div>
  </div>
</template>



<script>
import EditProject from "./EditProject.vue";

export default {
  name: "ProjectCard",

  components: {
    "edit-project": EditProject,
  },
  data() {
    return {
      hoverCard: false,
      hoverEdit: false,
      displayEditModal: false,
    };
  },
  props: {
    projectTitle: {
      type: String,
      required: true,
    },
    projectId: {
      type: String,
      required: true,
    },
    allProjectTitles: {
      type: Array,
      required: true,
    },
  },
  methods: {
    enterEdit: function () {
      this.hoverCard = false;
      this.hoverEdit = true;
    },
  },
};
</script>
 



<style scoped>
.flipCard {
  background: transparent;
  height: 100px;
  width: 150px;
  perspective: 1000px;
  margin: 10px 10px;
}

.flip-inner {
  position: relative;
  width: 100%;
  height: 100%;
  text-align: center;
  transition: transform 0.6s;
  transform-style: preserve-3d;
}

.projectCardWrapper {
  /* position: relative; */
  display: flex;
  align-items: flex-end;
  padding-left: 10px;
  box-sizing: border-box;
  height: 100%;
  width: 100%;
  background: linear-gradient(145deg, #fdffff, #d4d7e0);
  box-shadow: 8px 8px 16px #b6b8c0, -8px -8px 16px #ffffff;

  border-radius: 10%;
}

/* change this hover */
.flipTransform {
  transform: rotateY(180deg);
}

.flip-front,
.flip-back {
  position: absolute;
  width: 100%;
  height: 100%;
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;

  background: linear-gradient(145deg, #fdffff, #d4d7e0);
  box-shadow: 8px 8px 16px #b6b8c0, -8px -8px 16px #ffffff;
}

.flip-back {
  transform: rotateY(180deg);
}

.hoverClass:hover {
  background: linear-gradient(145deg, #d4d7e0, #fdffff);
  box-shadow: 8px 8px 16px #b6b8c0, -8px -8px 16px #ffffff;
}

.expandTransition {
  transition: letter-spacing 0.5s;
}

.expand {
  letter-spacing: 4px;
}

.hide {
  display: none;
}

/* #E8E8E8#E8E8E8#E8E8E8 */
</style>