<template>
  <div
    class="flex flex-col items-center justify-center h-screen w-screen"
    style="background: #eceff9"
  >
    <div
      class="rounded-xl h-3/4 w-5/6 md:w-1/2 max-w-lg items-center flex flex-col justify-evenly testContainer py-4"
      style="background: #eceff9"
    >
      <h2 class="text-3xl text-blue-400">Register</h2>

      <form
        class="flex flex-col items-start w-5/6 max-w-xs"
        @submit="submitForm"
      >
        <h4 v-show="error.length" class="text-red-500">{{ error }}</h4>
        <h3 class="pl-3">Username</h3>
        <h4 v-show="errorUsername.length" class="text-red-500 pl-3">
          {{ errorUsername }}
        </h4>
        <input
          type="text"
          name=""
          v-model="username"
          v-on:blur="onOffFocusUsername"
          class="focus:outline-none h-8 rounded-2xl m-1 pl-5 shadow-neumorButton focus:shadow-inner w-full"
        />
        <h3 class="pl-3">Email</h3>
        <input
          name=""
          v-model="email"
          class="focus:outline-none h-8 rounded-2xl m-1 pl-5 shadow-neumorButton focus:shadow-inner w-full"
        />
        <h3 class="pl-3">Password</h3>

        <div class="w-full" data-tip="Password must be 8 characters">
          <input
            type="password"
            name=""
            v-model="password"
            class="focus:outline-none h-8 rounded-2xl m-1 pl-5 shadow-neumorButton focus:shadow-inner w-full"
          />
        </div>
        <h3 class="pl-3">Confirm Password</h3>
        <input
          type="password"
          name=""
          v-model="confirmPassword"
          class="focus:outline-none h-8 rounded-2xl m-1 pl-5 shadow-neumorButton focus:shadow-inner w-full"
        />
        <div
          class="flex w-11/12 md:2/3 justify-around items-center self-center mt-5"
        >
          <router-link
            class="rounded-3xl w-32 h-11 text-red-500 p-2 shadow-neumorButton focus:outline-none active:shadow-inner"
            style="background: #eceff9"
            to="/"
          >
            Cancel
          </router-link>
          <!-- <button>huh</button> -->

          <button
            class="rounded-3xl w-32 h-11 text-green-500 p-2 shadow-neumorButton focus:outline-none active:shadow-inner"
            style="background: #eceff9"
            type="submit"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import gql from "graphql-tag";

export default {
  name: "Register",
  data() {
    return {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      error: "",
      errorUsername: false,
      allUsers: null,
    };
  },
  apollo: {
    allUsers: gql`
      query allUsers {
        allUsers {
          username
        }
      }
    `,
  },
  computed: {
    allUsernamesArray: function () {
      let usernameArray = this.allUsers.map((user) => user.username);

      return usernameArray;
    },
  },
  methods: {
    createNewUser: function () {
      console.log("pew create");
    },
    onOffFocusUsername: function () {
      this.errorUsername = "";
      // Check for a-z A-Z . - _

      if (this.username === "") {
        return;
      }

      if (!this.validateUsername(this.username)) {
        this.errorUsername = "Username can only contain A-Z, _ , . or -";
        return;
      }

      // Check if username is taken
      if (this.allUsernamesArray.includes(this.username)) {
        this.errorUsername = "Username already taken";
        return;
      }

      this.errorUsername = "";
    },
    validateUsername: function (username) {
      return /^[0-9a-zA-Z_.-]+$/.test(username);
    },
    submitForm: function (e) {
      e.preventDefault();

      this.error = "";
      const { username, email, password } = this;

      if (username === "" || email === "" || password === "") {
        this.error = "Please fill out all fields";
        return;
      }

      if (!this.validateEmail(email)) {
        this.error = "Please enter a valid email";
        return;
      }

      if (password.length < 9) {
        this.error.password = "Password must be 8 characters";
        return;
      } else if (password !== this.confirmPassword) {
        this.error = "Passwords don't match";
        return;
      }

      this.$apollo
        .mutate({
          mutation: gql`
            mutation createUser(
              $username: String!
              $password: String!
              $email: String!
            ) {
              createNewUser(
                username: $username
                password: $password
                email: $email
              ) {
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
            username,
            password,
            email,
          },
        })
        .then((res) => {
          const { user, token } = res.data.createNewUser;

          localStorage.setItem("jello-token", token);
          this.$router.push({
            name: "Home",
            params: { userData: user },
          });
        })
        .catch((err) => console.log(err));
    },
    validateEmail: function (email) {
      var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(email);
    },
    // fetchUsernames: function () {
    //   axios({
    //     url: "/graphql",
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     data: {
    //       query: `{users{
    //               username
    //             }}`,
    //     },
    //   })
    //     .then((res) => {
    //       const arrayOfUsernameObjects = res.data.data.users;
    //       let usernameArray = arrayOfUsernameObjects.map((user) => {
    //         return user.username;
    //       });

    //       this.unvalidUsernames = usernameArray;
    //     })
    //     .catch((err) => console.log(err));
    // },
  },
  // mounted: function () {
  //   this.fetchUsernames();
  // },
};
</script>




<style scoped>
.testContainer {
  background: linear-gradient(225deg, #fdffff, #d4d7e0);
  box-shadow: -35px 35px 70px #b8bac2, 35px -35px 70px #ffffff;
}

[data-tip] {
  position: relative;
}

[data-tip]:after {
  display: none;
  content: attr(data-tip);
  position: absolute;
  top: 2.5rem;
  left: 0px;
  padding: 5px 8px;
  background: #eceff9;
  height: 100px;
  color: black;
  z-index: 9;
  font-size: 0.75em;
  height: fit-content;
  line-height: 18px;
  -webkit-border-radius: 3px;
  -moz-border-radius: 3px;
  border-radius: 3px;
  white-space: nowrap;
  word-wrap: normal;
  box-shadow: 5px 5px 10px #b8bac2, -5px -5px 10px #ffffff;
}
[data-tip]:hover:before,
[data-tip]:hover:after {
  display: block;
}
</style>
