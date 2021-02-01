interface State {
  UIstatus: any;
  Notifications: any;
}

const state = {
  UIstatus: {
    InternetDialog: false,
  },
  Notifications: [],
};

const mutations = {
  UPDATE_INTERNET_DIALOG(state: State, status: boolean) {
    state.UIstatus.InternetDialog = status;
  },
  UPDATE_NOTIFICATION(state: State, data: any) {
    state.Notifications.push(data);
  },
};

const actions = {
  UpdateInternetDialog({ commit }: any, status: boolean) {
    commit("UPDATE_INTERNET_DIALOG", status);
  },

  PushNotification({ commit }: any, data: any) {
    commit("UPDATE_NOTIFICATION", data);
  },
};

const getters = {
  UIstatus: (state: State) => state.UIstatus,
  Notifications: (state: State) => state.Notifications,
};

export const ui = {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
