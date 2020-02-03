import axios from "axios";
import {
  TypeAction,
  getConfiguration,
  TypeProgramming,
  SecurityConfiguration
} from "@/services/config";

const GET_CONFIGURATION = "getConfiguration";
const UPDATE_CONFIGURATION = "updateConfiguration";

const GET_PROGRAMMING = "getProgramming";
const ADD_PROGRAMMING = "addProgramming";
const DELETE_PROGRAMMING = "deleteProgramming";
const UPDATE_PROGRAMMING = "updateProgramming";
const local = false;

export default class HttpMonitor {
  constructor() {
    this.configuration = getConfiguration();
  }

  getPostSecurityHeader() {
    let headers = {
      "Content-Type": "application/x-www-form-urlencoded; charset=utf-8"
    };
    return this.getSecurityHeader(headers);
  }
  getSecurityHeader(headers) {
    if (typeof headers === "undefined") headers = {};
    if (SecurityConfiguration.basicAuthRequired) {
      headers.Authorization = SecurityConfiguration.basicAuth;
    }
    if (SecurityConfiguration.jwtRequired) {
      let token = localStorage.getItem("jwt");
      if (token === null) throw new Error("No security record found!");
      else headers.JWTToken = token;
    }
    return headers;
  }
  getUrl(functionUrl, queryParams) {
    var outUrl = this.configuration.serverUrl + functionUrl;
    if (queryParams && queryParams.length > 0) {
      outUrl += "?";
      for (var index = 0; index < queryParams.length; index++)
        if (index == 0)
          outUrl += queryParams[index].key + "=" + queryParams[index].value;
        else
          outUrl +=
            "&" + queryParams[index].key + "=" + queryParams[index].value;
    }
    console.log("Call " + outUrl);
    return outUrl;
  }

  getConfiguration() {
    var queryParams = [];
    return axios.get(this.getUrl(GET_CONFIGURATION, queryParams), {
      headers: this.getSecurityHeader()
    });
  }

  getProgramming(type) {
    let qType = "temp";
    if (type) qType = type === TypeProgramming.THEMP ? "temp" : "light";
    var queryParams = [{ key: "type", value: qType }];
    return axios.get(this.getUrl(GET_PROGRAMMING, queryParams), {
      headers: this.getSecurityHeader()
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
        headers: this.getPostSecurityHeader()
      });
    else
      return axios.get(url, {
        headers: this.getSecurityHeader()
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
    return axios.post(
      this.getUrl(ADD_PROGRAMMING),
      "data=" + JSON.stringify({ type: type }),
      {
        headers: getPostSecurityHeader()
      }
    );
  }
  // application/x-www-form-urlencoded
  updateConfiguration(conf) {
    return axios.post(
      this.getUrl(UPDATE_CONFIGURATION),
      "data=" + JSON.stringify(conf),
      {
        headers: getPostSecurityHeader()
      }
    );
  }
}
