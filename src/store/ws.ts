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

    let gt = null;
    if (Object.values(rootState.client.ClientLog[data.ClientId]).length > 0) {
      gt = rootState.client.ClientLog[data.ClientId].slice(-1)[0]._id;
    }

    const LogData = await dispatch(
      "client/GetLogs",
      { clientid: data.ClientId, gt: gt },
      { root: true },
    );
    if (LogData.status === serverstatus.SUCCESS) {
      for (const i in LogData.logs) {
        rootState.client.ClientLog[data.ClientId].push(LogData.logs[i]);
      }
      await dispatch(
        "client/UpdateClientLog",
        { clientid: data.ClientId, logs: rootState.client.ClientLog[data.ClientId] },
        { root: true },
      );
      await dispatch(
        "client/UpdateNewLogTrigger",
        { ClientId: data.ClientId, unique: Date.now().toString() },
        { root: true },
      );
    }
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
