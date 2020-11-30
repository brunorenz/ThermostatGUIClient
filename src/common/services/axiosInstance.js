import axios from "axios";
import { doLogoff } from "@/common/services/security";
import router from "@/router";
import store from "@/store";

const mainAxios = axios.create();

let getFunctionFromUrl = function(url) {
  let functionName = url;
  var n = functionName.lastIndexOf("/");
  if (n >= 0) functionName = functionName.substring(n + 1);
  n = functionName.indexOf("?");
  if (n >= 0) functionName = functionName.substring(0, n);
  return functionName;
};
// Add a response interceptor
mainAxios.interceptors.response.use(
  function(response) {
    try {
      if (typeof response.data.error != "undefined") {
        console.log("(MAIN) Return code : " + response.data.error.code + " , Message : " + response.data.error.message);
        let error = {
          code: response.data.error.code,
          message: response.data.error.message,
          function: getFunctionFromUrl(response.config.url),
        };
        store.commit("errorMessage", error);
      }
    } catch (error) {
      console.log(error);
    }
    return response;
  },
  function(error) {
    try {
      let message = error.toJSON().message;
      let errorM = {
        code: 999,
        message: message,
        function: getFunctionFromUrl(error.config.url),
      };
      if (error.response)
        errorM = {
          code: error.response.status,
          message: message + " - " + error.response.statusText,
          function: getFunctionFromUrl(error.config.url),
        };
      store.commit("errorMessage", errorM);
    } catch (error) {
      console.log(error);
    }
    if (
      typeof error.response != "undefined" &&
      typeof error.response.status != "undefined" &&
      error.response.status === 403
    ) {
      doLogoff();
      router.push("/login");
    }
    return Promise.reject(error);
  }
);

export { mainAxios };
