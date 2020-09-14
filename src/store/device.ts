import serverstatus from "@/utils/status";
import ColorCode from "@/utils/color-code";

interface State {
  DeviceID: any;
  DeviceLog: any;
  NewLog: any;
  DeviceSettings: any;
}

const state = {
  DeviceID: [],
  DeviceLog: {},
  LogStyle: {},
  NewLog: {},
  DeviceSettings: {}
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
    state.DeviceID = data;
  },
  UPDATE_DEVICE_LOG(state: State, { deviceid: deviceid, logs: data }: any) {
    if (data !== null) {
      for (let i = 0; i < data.length; i++) {
        const ret = ColorParser(data[i].log);
        data[i].stylelog = ret.text;
        data[i].style = ret.style;
      }
    }

    /* This command is not rerender in vue component */
    // state.DeviceLog[deviceid] = data;

    /* Using Vue.set to make sure DeviceLog state update to vue component */
    (this as any)._vm.$set(state.DeviceLog, deviceid, data);
  },
  REMOVE_DEVICE_ID(state: State, deviceid: string) {
    (this as any)._vm.$delete(state.DeviceLog, deviceid);
  },
  UPDATE_NEW_LOG(state: State, data: any) {
    state.NewLog = data;
  },
  UPDATE_SETTINGS(
    state: State,
    { deviceid: deviceid, settings: settings }: any
  ) {
    (this as any)._vm.$set(state.DeviceSettings, deviceid, settings);
  }
};

const actions = {
  List({ commit }: any) {
    return new Promise((resolve, reject) => {
      (this as any)._vm.$axios
        .get("/api/v1/device/list")
        .then(function(response: any) {
          if (response.data.status === serverstatus.SUCCESS) {
            commit("SET_DEVICE_ID", response.data.list);
          }
          resolve(response.data);
        })
        .catch(function(error: any) {
          reject(error);
        });
    });
  },
  Register({ dispatch }: any, name: any) {
    return new Promise((resolve, reject) => {
      (this as any)._vm.$axios
        .post("/api/v1/device/register", { name: name })
        .then((response: any) => {
          dispatch("List");
          if (response.data.status === serverstatus.SUCCESS) {
            (this as any)._vm.$notify({
              title: "Register Device",
              message: response.data.msg,
              type: "success"
            });
          } else {
            (this as any)._vm.$notify({
              title: "Register Device",
              message: response.data.msg,
              type: "error"
            });
          }
          resolve(response.data);
        })
        .catch(function(error: any) {
          reject(error);
        });
    });
  },
  Remove({ dispatch }: any, deviceid: any) {
    return new Promise((resolve, reject) => {
      (this as any)._vm.$axios
        .post("/api/v1/device/remove", { deviceid: deviceid })
        .then((response: any) => {
          dispatch("List");
          if (response.data.status === serverstatus.SUCCESS) {
            (this as any)._vm.$notify({
              title: "Remove Device",
              message: response.data.msg,
              type: "success"
            });
          } else {
            (this as any)._vm.$notify({
              title: "Remove Device",
              message: response.data.msg,
              type: "error"
            });
          }
          resolve(response.data);
        })
        .catch(function(error: any) {
          reject(error);
        });
    });
  },
  LoadSettings({ commit }: any, deviceid: any) {
    return new Promise((resolve, reject) => {
      (this as any)._vm.$axios
        .post("/api/v1/device/settings", { deviceid: deviceid })
        .then((response: any) => {
          resolve(response.data);
          if (response.data.status === serverstatus.SUCCESS) {
            commit("UPDATE_SETTINGS", {
              deviceid: deviceid,
              settings: response.data.settings
            });
          }
        })
        .catch(function(error: any) {
          reject(error);
        });
    });
  },
  SaveSettings(_: any, { deviceid: deviceid, settings: settings }: any) {
    return new Promise((resolve, reject) => {
      (this as any)._vm.$axios
        .post("/api/v1/device/savesettings", {
          deviceid: deviceid,
          settings: settings
        })
        .then((response: any) => {
          resolve(response.data);
        })
        .catch(function(error: any) {
          reject(error);
        });
    });
  },
  UpdateDeviceLog({ commit }: any, data: any) {
    commit("UPDATE_DEVICE_LOG", data);
  },
  RemoveDeviceID({ commit }: any, deviceid: string) {
    commit("REMOVE_DEVICE_ID", deviceid);
  },
  GetLogs(_: any, body: any) {
    return new Promise((resolve, reject) => {
      (this as any)._vm.$axios
        .post("/api/v1/logger/getlog", body)
        .then((response: any) => {
          resolve(response.data);
        })
        .catch(function(error: any) {
          reject(error);
        });
    });
  },
  UpdateNewLogTrigger({ commit }: any, data: any) {
    commit("UPDATE_NEW_LOG", data);
  },
  SendCommand(_: any, { deviceid: deviceid, command: command }: any) {
    return new Promise((resolve, reject) => {
      (this as any)._vm.$axios
        .post("/api/v1/device/sendcommand", {
          deviceid: deviceid,
          command: command
        })
        .then((response: any) => {
          resolve(response.data);
        })
        .catch(function(error: any) {
          reject(error);
        });
    });
  },
  SendCommandline(_: any, { deviceid: deviceid, string: string }: any) {
    return new Promise((resolve, reject) => {
      (this as any)._vm.$axios
        .post("/api/v1/device/sendcommandline", {
          deviceid: deviceid,
          string: string
        })
        .then((response: any) => {
          resolve(response.data);
        })
        .catch(function(error: any) {
          reject(error);
        });
    });
  }
};

const getters = {
  DeviceID: (state: State) => state.DeviceID,
  DeviceLog: (state: State) => state.DeviceLog,
  NewLog: (state: State) => state.NewLog,
  DeviceSettings: (state: State) => state.DeviceSettings
};

export const device = {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};
