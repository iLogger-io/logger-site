import Vue from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";
import axios from "axios";
import "@fortawesome/fontawesome-free/css/all.css";
import "@fortawesome/fontawesome-free/js/all.js";
import Element from "element-ui";
import lang from "element-ui/lib/locale/lang/en";
import locale from "element-ui/lib/locale";
import "element-ui/lib/theme-chalk/index.css";

// configure language
locale.use(lang);
Vue.use(Element, { locale });
Vue.config.productionTip = false;
Vue.use({
  install(Vue) {
    Vue.prototype.$axios = axios.create({
      baseURL: process.env.VUE_APP_APIURL,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
      },
    });
  },
});
new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
