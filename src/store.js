import Vue from "vue";
import Vuex from "vuex";
Vue.use(Vuex);

const KEY_USER = "MBUSER";

let cleanLocalStorage = function(key) {
  window.sessionStorage.setItem(key, {});
};

let recuperaLocalStorage = function(key) {
  let s = window.sessionStorage.getItem(key);
  try {
    if (s != null) return JSON.parse(s);
  } catch (error) {
    console.log(error);
  }
  return {};
};

let leggiAttributoLocalStorage = function(key, def) {
  let value = recuperaLocalStorage(KEY_USER)[key];
  if (value === undefined) value = def;
  return value;
};

let salvaAttributoLocalStorage = function(key, value) {
  let usr = recuperaLocalStorage(KEY_USER);
  usr[key] = value;
  window.sessionStorage.setItem(KEY_USER, JSON.stringify(usr));
};
// https://stackoverflow.com/questions/50125249/vuex-computed-properties-are-not-reactive
// per abilitare react property esplicita con relativo getter
let store = new Vuex.Store({
  state: {
    datiSessione: {},
    datiStorage: {
      uid: "",
    },
    errorMessage: {},
  },
  getters: {
    errorMessage: (state) => {
      return state.errorMessage;
    },

    uid: (state) => {
      let l = state.datiStorage.uid;
      if (l === "") l = leggiAttributoLocalStorage("uid", "");
      return l;
    },

    storage: (state) => (key) => {
      let d = state.datiStorage;
      if (d === undefined) d = {};
      if (d[key] === undefined) {
        let usr = recuperaLocalStorage(KEY_USER);
        return usr[key];
      }
      return d[key];
    },
    session: (state) => (key) => {
      let d = state.datiSessione;
      if (d === undefined) d = {};
      return d[key];
    },
  },
  mutations: {
    cleanSession(state) {
      state.datiSessione = {};
      state.datiStorage = {};
      cleanLocalStorage(KEY_USER);
    },

    logon(state, uid) {
      state.uid = uid;
      salvaAttributoLocalStorage("uid", uid);
    },

    updateKeyStorage(state, { key, value }) {
      if (key) {
        state.datiStorage[key] = value;
        salvaAttributoLocalStorage(key, value);
      }
    },

    updateKeySession(state, { key, value }) {
      if (state.datiSessione === undefined) state.datiSessione = {};
      if (key) {
        state.datiSessione[key] = value;
      }
    },

    errorMessage(state, errorMessage) {
      state.errorMessage = errorMessage;
    },
  },
  actions: {},
});

export default store;
