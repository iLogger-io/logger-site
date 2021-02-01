import store from "../store";
import Vue from "vue";

export default function auth({ next }: any) {
  const token = store.getters["user/Token"];
  if (token === undefined) {
    return next({ name: "Login" });
  } else {
    Vue.prototype.$axios.defaults.headers["Authorization"] = `Bearer ${token}`;
    return next();
  }
}
