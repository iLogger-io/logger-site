import serverstatus from "@/utils/status";
import Cookies from "js-cookie";

interface State {
  token: any;
}

const state = {
  token: Cookies.get("token"),
};

const mutations = {
  SET_TOKEN(state: State, data: string) {
    state.token = data;
    Cookies.set("token", data, {
      expires: 30,
    });
  },
};

const actions = {
  Signup({ commit }: any, body: any) {
    return new Promise((resolve, reject) => {
      (this as any)._vm.$axios
        .post("/api/v1/auth/signup", JSON.stringify(body))
        .then(function (response: any) {
          resolve(response.data);
        })
        .catch(function (error: any) {
          reject(error);
        });
    });
  },
  Login({ commit }: any, body: any) {
    return new Promise((resolve, reject) => {
      (this as any)._vm.$axios
        .post("/api/v1/auth/login", JSON.stringify(body))
        .then(function (response: any) {
          if (response.data.status === serverstatus.SUCCESS) {
            commit("SET_TOKEN", response.data.payload.access_token);
          }
          resolve(response.data);
        })
        .catch(function (error: any) {
          reject(error);
        });
    });
  },
  VerifyEmail(_: any, body: any) {
    return new Promise((resolve, reject) => {
      (this as any)._vm.$axios
        .post("/api/v1/auth/verifyemail", JSON.stringify(body))
        .then(function (response: any) {
          if (response.data.status === serverstatus.SUCCESS) {
            console.log("OK");
          }
          console.log(response.data);
          resolve(response.data);
        })
        .catch(function (error: any) {
          reject(error);
        });
    });
  },
  SetToken({ commit }: any, token: string) {
    commit("SET_TOKEN", token);
  },
};

const getters = {
  Token: (state: State) => state.token,
};

export const user = {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
