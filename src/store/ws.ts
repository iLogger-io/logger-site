import { Vue } from "vue-property-decorator";

interface State {
  WS: WebSocket | null;
}

const state = {
  WS: null,
};

const mutations = {
  SET_WS(state: State, ws: WebSocket) {
    state.WS = ws;
  },
};

const actions = {
  InitWs({ commit }: any) {
    const ws: WebSocket = new WebSocket(process.env.VUE_APP_APIURL_WS!);
    ws.onopen = () => {
      console.log("WS onopen");
    };
    ws.onmessage = (ev: MessageEvent) => {
      const message = JSON.parse(ev.data);
      console.log(message);
    };
    ws.onclose = (ev: CloseEvent) => {
      console.log("WS onclose", ev);
    };
    // commit("SET_WS", ws);
    Vue.prototype.$ws = ws;
  },
};

const getters = {};

export const ws = {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
