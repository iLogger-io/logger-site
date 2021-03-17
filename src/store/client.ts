import serverstatus from "@/utils/status";
import ColorCode from "@/utils/color-code";

interface State {
  ClientID: any;
  ClientLog: any;
  NewLog: any;
  ClientSettings: any;
}

const state = {
  ClientID: [],
  ClientLog: {},
  LogStyle: {},
  NewLog: {},
  ClientSettings: {},
};

function ColorParser(text: string) {
  let style: any = {};
  if (text.trim().length === 0) {
    text = "[SPACE]";
    style = { color: "#013d4b" };
    return { text: text, style: style };
  }
  for (let i = 0; i < Object.keys(ColorCode).length; i++) {
    const code = Object.values(ColorCode)[i].code;
    if (text.indexOf(code) >= 0) {
      if (code !== ColorCode.Reset.code) {
        style = Object.values(ColorCode)[i];
        style = style.style;
      }
      const re = new RegExp(`\\${code}`, "g");
      text = text.replace(re, "");
    }
  }

  return { text: text, style: style };
}

const mutations = {
  SET_DEVICE_ID(state: State, data: any) {
    state.ClientID = data;
  },
  UPDATE_DEVICE_LOG(state: State, { clientid: clientid, logs: data }: any) {
    if (data !== null) {
      for (let i = 0; i < data.length; i++) {
        const ret = ColorParser(data[i].log);
        data[i].stylelog = ret.text;
        data[i].style = ret.style;
      }
    }

    /* This command is not rerender in vue component */
    // state.ClientLog[clientid] = data;

    /* Using Vue.set to make sure ClientLog state update to vue component */
    (this as any)._vm.$set(state.ClientLog, clientid, data);
  },
  REMOVE_DEVICE_ID(state: State, clientid: string) {
    (this as any)._vm.$delete(state.ClientLog, clientid);
  },
  UPDATE_NEW_LOG(state: State, data: any) {
    state.NewLog = data;
  },
  UPDATE_SETTINGS(state: State, { clientid: clientid, settings: settings }: any) {
    (this as any)._vm.$set(state.ClientSettings, clientid, settings);
  },
};

const actions = {
  List({ commit }: any) {
    return new Promise((resolve, reject) => {
      (this as any)._vm.$axios
        .get("/api/v1/client/list")
        .then(function (response: any) {
          if (response.data.status === serverstatus.SUCCESS) {
            commit("SET_DEVICE_ID", response.data.payload.list);
          }
          resolve(response.data);
        })
        .catch(function (error: any) {
          reject(error);
        });
    });
  },
  Register({ dispatch }: any, name: any) {
    return new Promise((resolve, reject) => {
      (this as any)._vm.$axios
        .post("/api/v1/client/register", { name: name })
        .then((response: any) => {
          dispatch("List");
          if (response.data.status === serverstatus.SUCCESS) {
            (this as any)._vm.$notify({
              title: "Register Client",
              message: response.data.msg,
              type: "success",
            });
          } else {
            (this as any)._vm.$notify({
              title: "Register Client",
              message: response.data.msg,
              type: "error",
            });
          }
          resolve(response.data);
        })
        .catch(function (error: any) {
          reject(error);
        });
    });
  },
  Remove({ dispatch }: any, clientid: any) {
    return new Promise((resolve, reject) => {
      (this as any)._vm.$axios
        .post("/api/v1/client/remove", { clientid: clientid })
        .then((response: any) => {
          dispatch("List");
          if (response.data.status === serverstatus.SUCCESS) {
            (this as any)._vm.$notify({
              title: "Remove Client",
              message: response.data.msg,
              type: "success",
            });
          } else {
            (this as any)._vm.$notify({
              title: "Remove Client",
              message: response.data.msg,
              type: "error",
            });
          }
          resolve(response.data);
        })
        .catch(function (error: any) {
          reject(error);
        });
    });
  },
  LoadSettings({ commit }: any, clientid: any) {
    return new Promise((resolve, reject) => {
      (this as any)._vm.$axios
        .post("/api/v1/client/settings", { clientid: clientid })
        .then((response: any) => {
          resolve(response.data);
          if (response.data.status === serverstatus.SUCCESS) {
            commit("UPDATE_SETTINGS", {
              clientid: clientid,
              settings: response.data.settings,
            });
          }
        })
        .catch(function (error: any) {
          reject(error);
        });
    });
  },
  SaveSettings(_: any, { clientid: clientid, settings: settings }: any) {
    return new Promise((resolve, reject) => {
      (this as any)._vm.$axios
        .post("/api/v1/client/savesettings", {
          clientid: clientid,
          settings: settings,
        })
        .then((response: any) => {
          resolve(response.data);
        })
        .catch(function (error: any) {
          reject(error);
        });
    });
  },
  ClearLog(_: any, { clientid: clientid }: any) {
    return new Promise((resolve, reject) => {
      (this as any)._vm.$axios
        .post("/api/v1/client/cleanlog", {
          clientid: clientid,
        })
        .then((response: any) => {
          resolve(response.data);
        })
        .catch(function (error: any) {
          reject(error);
        });
    });
  },
  UpdateClientLog({ commit }: any, data: any) {
    commit("UPDATE_DEVICE_LOG", data);
  },
  RemoveClientID({ commit }: any, clientid: string) {
    commit("REMOVE_DEVICE_ID", clientid);
  },
  GetLogs(_: any, body: any) {
    return new Promise((resolve, reject) => {
      (this as any)._vm.$axios
        .post("/api/v1/logger/getlog", body)
        .then((response: any) => {
          resolve(response.data);
        })
        .catch(function (error: any) {
          reject(error);
        });
    });
  },
  UpdateNewLogTrigger({ commit }: any, data: any) {
    commit("UPDATE_NEW_LOG", data);
  },
  SendCommand(_: any, { clientid: clientid, command: command }: any) {
    return new Promise((resolve, reject) => {
      (this as any)._vm.$axios
        .post("/api/v1/client/sendcommand", {
          clientid: clientid,
          command: command,
        })
        .then((response: any) => {
          resolve(response.data);
        })
        .catch(function (error: any) {
          reject(error);
        });
    });
  },
  SendCommandline(_: any, { clientid: clientid, string: string }: any) {
    return new Promise((resolve, reject) => {
      (this as any)._vm.$axios
        .post("/api/v1/client/sendcommandline", {
          clientid: clientid,
          string: string,
        })
        .then((response: any) => {
          resolve(response.data);
        })
        .catch(function (error: any) {
          reject(error);
        });
    });
  },
};

const getters = {
  ClientID: (state: State) => state.ClientID,
  ClientLog: (state: State) => state.ClientLog,
  NewLog: (state: State) => state.NewLog,
  ClientSettings: (state: State) => state.ClientSettings,
};

export const client = {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
