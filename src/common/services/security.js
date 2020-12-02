import store from "@/store";
import router from "@/router";

export function checkSecurity() {
  if (SecurityConfiguration.jwtRequired) {
    let token = window.sessionStorage.getItem("jwttoken");
    if (token == null) {
      router.push("/login");
    }
  }
}
// Definizioni da Server

// Sicurezza
export var SecurityConfiguration = {
  basicAuth: "Basic YWRtaW46YWgwNjB2eUEu",
  basicAuthRequired: true,
  jwtRequired: true,
};

export function isUserLogged() {
  let uid = store.getters.uid;
  let logged = uid != "";
  console.log("UDI : " + uid + " - Logged " + logged);
  return logged;
}
let updateUid = function(uid) {
  store.commit("updateKeyStorage", {
    key: "uid",
    value: uid,
  });
};
export function doLogoff() {
  updateUid("");
}

export function doLogon(uid) {
  updateUid(uid);
}

export function getXrfToken() {
  return window.sessionStorage.getItem("jwttoken");
}
