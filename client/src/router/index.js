import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import Project from "../views/Project.vue";
import Login from "../views/Login.vue";
import Register from "../views/Register.vue";
import axios from "axios";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Login",
    component: Login,
    meta: {
      guest: true,
    },
  },
  {
    path: "/register",
    name: "Register",
    component: Register,
    meta: {
      guest: true,
    },
  },
  {
    path: "/home",
    name: "Home",
    component: Home,
    props: true,
    meta: {
      requireAuth: true,
    },
  },
  {
    path: "/project/:id",
    name: "Project",
    component: Project,
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.requireAuth)) {
    if (localStorage.getItem("jello-token") === null) {
      next({ name: "Login" });
    } else {
      const token = localStorage.getItem("jello-token");
      axios({
        method: "POST",
        url: "http://localhost:4000/checkToken",
        headers: {
          authorization: "Bearer " + token,
        },
      })
        .then((res) => {
          const tokenStatus = res.data;

          tokenStatus ? next() : next({ name: "Login" });
        })
        .catch(() => {
          next({ name: "Login" });
        });

      next();
    }
  } else {
    next();
  }
});

export default router;
