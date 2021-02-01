import Vue from "vue";
import Vuex from "vuex";

import { user } from "./user";
import { client } from "./client";
import { ui } from "./ui";
import { ws } from "./ws";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    user,
    client,
    ui,
    ws,
  },
});
