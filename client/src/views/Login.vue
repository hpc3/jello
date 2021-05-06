<template>
  <div
    id="loginContainer"
    class="flex flex-col items-center justify-center h-screen"
  >
    <div
      class="rounded-xl sm:h-3/5 sm:w-3/5 w-5/6 h-3/5 max-w-lg items-center flex flex-col justify-evenly testContainer"
    >
      <div
        class="flex items-center justify-between flex-1"
        style="width: fit-content"
      >
        <img
          src="../assets/trello-logo.png"
          alt="Trello Logo"
          height="60px"
          width="60px"
        />
        <h1 class="text-6xl ml-5">Jello</h1>
      </div>

      <div v-show="loading" class="flex-1 flex items-center">
        <h2 class="text-blue-400 text-xl">Loading....</h2>
      </div>

      <div
        id="mainLogin"
        class="flex flex-col flex-1 justify-evenly w-3/4 sm:w-2/3 max-w-md"
        v-show="!loading"
      >
        <h4 v-show="error.length" class="text-red-500 pb-3">{{ error }}</h4>
        <input
          type="text"
          placeholder="Username or Email"
          class="focus:outline-none h-10 rounded-2xl m-1 pl-5 shadow-neumorButton focus:shadow-inner"
          v-model="identifier"
        />
        <input
          type="password"
          placeholder="Password"
          class="focus:outline-none h-10 rounded-2xl m-1 pl-5 shadow-neumorButton focus:shadow-inner"
          v-model="password"
        />
      </div>
      <div class="flex w-3/4 sm:w-2/3 justify-around items-center flex-1">
        <button
          class="rounded-3xl sm:w-32 w-24 h-11 text-green-500 p-2 shadow-neumorButton focus:outline-none active:shadow-inner loginButton"
          style="background: #eceff9"
          @click="loginUser"
        >
          Login
        </button>
        <router-link to="/register">
          <button
            class="rounded-3xl sm:w-32 w-24 h-11 text-blue-500 p-2 shadow-neumorButton focus:outline-none active:shadow-inner loginButton"
            style="background: #eceff9"
          >
            Register
          </button>
        </router-link>
      </div>
    </div>
  </div>
</template>




<script>
import gql from "graphql-tag";

export default {
  name: "Login",
  data() {
    return {
      identifier: "",
      password: "",
      error: "",
      loading: false,
    };
  },
  methods: {
    loginUser: function () {
      const identifier = this.identifier;
      const password = this.password;

      this.error = "";
      this.loading = true;

      this.$apollo
        .mutate({
          mutation: gql`
            mutation userLogin($identifier: String!, $password: String!) {
              loginUser(identifier: $identifier, password: $password) {
                user {
                  id
                }
                token
              }
            }
          `,
          variables: {
            identifier,
            password,
          },
        })
        .then((res) => {
          const { user, token } = res.data.loginUser;

          localStorage.setItem("jello-token", token);
          localStorage.setItem("jello-userID", user.id);
          this.$router.push({
            name: "Home",
          });
        })
        .catch((error) => {
          // Jank vvv
          const errorMessage = error.message.split(": ")[1];
          switch (errorMessage) {
            case "User Does Not Exist":
              this.error = "Incorrect Username/Email";
              break;
            case "Missing Data":
              this.error = "Please Fill Out All Fields";
              break;
            case "Password does not match":
              this.error = "Incorrect Password";
              break;
            default:
              this.error = "Something went wrong";
              break;
          }

          this.loading = false;
        });
    },
    enterToSubmit: function () {
      window.addEventListener("keydown", (e) => {
        return e.key === "Enter" ? this.loginUser() : null;
      });
    },
  },
  mounted() {
    this.enterToSubmit();
  },
};
</script>




<style scoped>
.testContainer {
  background: linear-gradient(225deg, #fdffff, #d4d7e0);
  box-shadow: -35px 35px 70px #b8bac2, 35px -35px 70px #ffffff;
}

.loginButton {
  background: linear-gradient(145deg, #fdffff, #d4d7e0);
}

.loginButton:hover,
.loginButton:active {
  background: #eceff9;
  box-shadow: inset 20px 20px 60px #c9cbd4, inset -20px -20px 60px #ffffff;
}
</style>