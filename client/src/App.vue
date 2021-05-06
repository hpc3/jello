<template>
  <div id="app">
    <div
      id="nav"
      class="bg-blue-500"
      v-if="this.$route.path !== '/' && this.$route.path !== '/register'"
    >
      <div class="flex-1"></div>
      <div class="flex flex-row items-center justify-between w-24">
        <img
          src="./assets/trello-logo.png"
          alt="Trello Logo"
          height="25px"
          width="25px"
        />
        <h1 class="text-3xl text-white">Jello</h1>
      </div>
      <h2 class="flex-1 text-right tex">Settings</h2>
    </div>
    <router-view />
  </div>
</template>

<script>
</script>


<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  background-color: #eceff9;
  min-height: 100vh;
  height: fit-content;
}

#nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  height: 10vh;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
