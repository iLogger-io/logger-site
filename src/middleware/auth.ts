import store from "../store";
import Vue from "vue";

export default function auth({ next }: any) {
  const token = store.getters["auth/token"];
  if (!token) {
    return next({ name: "login" });
  } else {
    Vue.prototype.$axios.defaults.headers["Authorization"] = `Bearer ${token}`;
    return next();
  }
}
