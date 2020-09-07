import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "./assets/styles/app.css";
import { firestorePlugin } from "vuefire";

Vue.config.productionTip = false;

Vue.use(firestorePlugin, { wait: true });

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
