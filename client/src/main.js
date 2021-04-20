import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import "tailwindcss/tailwind.css";

import VueApollo from "vue-apollo";

import ApolloClient from "apollo-boost";

Vue.use(VueApollo);

const apolloClient = new ApolloClient({
  uri: "http://localhost:4000/graphql",
});

const apolloProvider = new VueApollo({
  defaultClient: apolloClient,
});

Vue.config.productionTip = false;

new Vue({
  router,
  apolloProvider,
  render: (h) => h(App),
  el: "#app",
});
