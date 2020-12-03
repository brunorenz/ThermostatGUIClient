import axios from "axios";
import { TypeAction, getConfiguration, TypeProgramming, SecurityConfiguration } from "@/services/config";

import router from "@/router";

const GET_CONFIGURATION = "getConfiguration";
const UPDATE_CONFIGURATION = "updateConfiguration";
//const UPDATE_STATUS = "updateStatus";

//const GET_SENSORDATA = "getSensorData";
//const GET_RELEDATA = "getReleData";
//const GET_PROGRAMMING = "getProgramming";
//&const ADD_PROGRAMMING = "addProgramming";
//const DELETE_PROGRAMMING = "deleteProgramming";
//const UPDATE_PROGRAMMING = "updateProgramming";
const LOGIN = "login";
const GET_R_STATISTICS = "getReleStatistics";
const GET_S_STATISTICS = "getSensorStatistics";

const local = false;

// Add a response interceptor
axios.interceptors.response.use(
  function(response) {
    if (typeof response.data.error != "undefined") {
      console.log("Return code : " + response.data.error.code + " , Message : " + response.data.error.message);
    }
    return response;
  },
  function(error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    let a = error;
    if (
      typeof error.response != "undefined" &&
      typeof error.response.status != "undefined" &&
      error.response.status === 403
    ) {
      window.sessionStorage.removeItem("jwttoken");
      window.sessionStorage.removeItem("jwt");
      router.push("/login");
    }
    return Promise.reject(error);
  }
);

export default class HttpMonitor {
  constructor() {
    this.configuration = getConfiguration();
  }

  getPostSecurityHeader(auth) {
    let headers = {
      "Content-Type": "application/x-www-form-urlencoded; charset=utf-8",
    };
    if (typeof auth === "undefined") auth = true;
    return this.getSecurityHeader(headers, auth);
  }
  getSecurityHeader(headers, auth) {
    if (typeof headers === "undefined") headers = {};
    if (SecurityConfiguration.basicAuthRequired) {
      headers.Authorization = SecurityConfiguration.basicAuth;
    }
    if (typeof auth === "undefined") auth = false;
    if (SecurityConfiguration.jwtRequired && auth) {
      let token = window.sessionStorage.getItem("jwttoken");
      if (token == null) {
        //let a = router;
        router.push("/login");
        throw new Error("No security record found!");
      } else headers.JWTToken = token;
    }
    return headers;
  }
  getUrl(functionUrl, queryParams) {
    var outUrl = this.configuration.serverUrl + functionUrl;
    if (queryParams && queryParams.length > 0) {
      outUrl += "?";
      for (var index = 0; index < queryParams.length; index++)
        if (index == 0) outUrl += queryParams[index].key + "=" + queryParams[index].value;
        else outUrl += "&" + queryParams[index].key + "=" + queryParams[index].value;
    }
    console.log("Call " + outUrl);
    return outUrl;
  }

  login(email, password) {
    let inputData = {
      email: email,
      password: password,
    };
    let url = this.getUrl(LOGIN);
    return axios.post(url, "data=" + JSON.stringify(inputData), {
      headers: this.getPostSecurityHeader(false),
    });
  }

  getWeatherInfo() {
    let url = this.configuration.weatherMonitor.weatherUrl;
    url = url + "&id=" + this.configuration.weatherMonitor.id;
    console.log("Call " + url);
    return axios.get(url, {});
  }

  getConfiguration() {
    var queryParams = [];
    return axios.get(this.getUrl(GET_CONFIGURATION, queryParams), {
      headers: this.getSecurityHeader(),
    });
  }

  getStatistics(sType, type, interval) {
    var queryParams = [
      { key: "type", value: type },
      { key: "interval", value: interval },
    ];
    return axios.get(this.getUrl(sType === "RELE" ? GET_R_STATISTICS : GET_S_STATISTICS, queryParams), {
      headers: this.getSecurityHeader(),
    });
  }

  getProgramming(type) {
    let qType = "temp";
    if (type) qType = type === TypeProgramming.THEMP ? "temp" : "light";
    var queryParams = [{ key: "type", value: qType }];
    return axios.get(this.getUrl(GET_PROGRAMMING, queryParams), {
      headers: this.getSecurityHeader(),
    });
  }

  getSensorData() {
    return axios.get(this.getUrl(GET_SENSORDATA), {
      headers: this.getSecurityHeader(),
    });
  }

  getReleData() {
    return axios.get(this.getUrl(GET_RELEDATA), {
      headers: this.getSecurityHeader(),
    });
  }

  manageProgramming(inputData) {
    let url = "";
    let usePost = true;
    switch (inputData.action) {
      case TypeAction.READ:
        return getProgramming(inputData.type);
        break;
      case TypeAction.ADD:
        url = this.getUrl(ADD_PROGRAMMING);
        break;
      case TypeAction.UPDATE:
        url = this.getUrl(UPDATE_PROGRAMMING);
        break;
      case TypeAction.DELETE:
        url = this.getUrl(DELETE_PROGRAMMING);
        break;
    }

    if (usePost)
      return axios.post(url, "data=" + JSON.stringify(inputData), {
        headers: this.getPostSecurityHeader(),
      });
    else
      return axios.get(url, {
        headers: this.getSecurityHeader(),
      });
  }
  /*
  removeProgramming(inputData) {
    return axios.post(
      this.getUrl(REMOVE_PROGRAMMING),
      "data=" + JSON.stringify(inputData),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded; charset=utf-8"
        }
      }
    );
  }
  */
  addProgramming(type) {
    return axios.post(this.getUrl(ADD_PROGRAMMING), "data=" + JSON.stringify({ type: type }), {
      headers: getPostSecurityHeader(),
    });
  }

  updateConfiguration(inputData) {
    let url = this.getUrl(UPDATE_CONFIGURATION);
    return axios.post(url, "data=" + JSON.stringify(inputData), {
      headers: this.getPostSecurityHeader(),
    });
  }
  updateStatus(inputData) {
    let url = this.getUrl(UPDATE_STATUS);
    return axios.post(url, "data=" + JSON.stringify(inputData), {
      headers: this.getPostSecurityHeader(),
    });
  }
}
