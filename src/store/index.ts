import Vue from "vue";
import Vuex from "vuex";

import { user } from "./user";
import { device } from "./device";
import { ui } from "./ui";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    user,
    device,
    ui
  }
});
