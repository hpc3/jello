<template>
  <div
    id="loginContainer"
    class="flex flex-col items-center justify-center h-screen bg-lightBackground"
  >
    <div
      class="rounded-xl h-3/5 w-3/5 max-w-lg items-center flex flex-col justify-evenly testContainer"
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
        class="flex flex-col flex-1 justify-center w-2/3 max-w-md"
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
      <div class="flex w-2/3 justify-around items-center flex-1">
        <button
          class="rounded-3xl w-32 h-11 text-green-500 p-2 shadow-neumorButton focus:outline-none active:shadow-inner"
          style="background: #eceff9"
          @click="loginUser"
        >
          Login
        </button>
        <router-link to="/register">
          <button
            class="rounded-3xl w-32 h-11 text-blue-500 p-2 shadow-neumorButton focus:outline-none active:shadow-inner"
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
                  username
                  email
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
          this.$router.push({
            name: "Home",
            params: { userData: user },
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
.loginContainerShadow {
  box-shadow: 20px 20px 60px #bebebe, -20px -20px 60px #ffffff;
}

.testContainer {
  background: linear-gradient(225deg, #fdffff, #d4d7e0);
  box-shadow: -35px 35px 70px #b8bac2, 35px -35px 70px #ffffff;
}

.testContainerDark {
  background: linear-gradient(145deg, #2e2e2e, #272727);
  box-shadow: 14px 14px 28px #252525, -14px -14px 28px #313131;
}

.testShadow {
  box-shadow: 11px 11px 22px #b8bac2, -11px -11px 22px #ffffff;
}
</style>