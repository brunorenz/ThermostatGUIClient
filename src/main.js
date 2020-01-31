/* eslint-disable */

import Vue from "vue";
//import BootstrapVue from "bootstrap-vue";
import { BootstrapVue, BootstrapVueIcons } from "bootstrap-vue";
import App from "./App";
import router from "./router";

Vue.use(BootstrapVue);
Vue.use(BootstrapVueIcons);

Vue.config.productionTip = false;

new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
