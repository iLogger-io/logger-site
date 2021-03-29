import { WSDataType } from "../types/type";
import serverstatus from "../utils/status";
import globalVar from "../lib/global_var";
import pushNotificationBrowser from "../utils/pushNotification";

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
  InitWs({ commit, dispatch }: any) {
    const ws: WebSocket = new WebSocket(process.env.VUE_APP_APIURL_WS!);

    ws.onopen = () => {
      console.log("WS onopen");
      dispatch("SendToken");
    };
    ws.onmessage = (ev: MessageEvent) => {
      const message: WSDataType = JSON.parse(ev.data);
      console.log(message.topic);
      switch (message.topic) {
        case "pushlog":
          dispatch("PushLog", message.payload);
          break;
        case "push_notification":
          dispatch("WSPushNotification", message.payload);
          break;
      }
    };
    ws.onclose = (ev: CloseEvent) => {
      console.log("WS onclose", ev);
    };
    commit("SET_WS", ws);
  },

  SendToken({ rootState }: any) {
    rootState.ws.WS.send(
      JSON.stringify({
        topic: "client_token",
        payload: {
          token: rootState.user.token,
        },
      }),
    );
  },

  async PushLog({ dispatch, rootState }: any, data: any) {
    if (
      rootState.client.ClientLog[data.ClientId] === null ||
      globalVar.windowLogRendered === false
    ) {
      return;
    }
    globalVar.windowLogRendered = false;
    await dispatch(
      "client/UpdateNewLogTrigger",
      { ClientId: data.ClientId, unique: Date.now().toString() },
      { root: true },
    );
    // }
  },
  async WSPushNotification({ dispatch, rootState }: any, data: any) {
    if (rootState.client.ClientSettings[data.ClientId].PushNotifications.Browser === true) {
      pushNotificationBrowser("iLogger Notification", data.messages.msg);
    }
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
