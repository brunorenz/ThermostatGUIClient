/* eslint-disable */
import Vue from "vue";
import App from "./App";
import router from "./router";
import store from "./store";
import { BootstrapVue, BootstrapVueIcons } from "bootstrap-vue";

import "./registerServiceWorker";

import CryptoJS from "crypto-js";
Object.defineProperty(Vue.prototype, "$crypto", { value: CryptoJS });

Vue.use(BootstrapVue);
Vue.use(BootstrapVueIcons);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
