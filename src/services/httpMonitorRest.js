import axios from "axios";
import { getConfiguration, TypeProgramming } from "@/services/config";

const GET_CONFIGURATION = "getConfiguration";
const UPDATE_CONFIGURATION = "updateConfiguration";

const GET_PROGRAMMING = "getProgramming";
const ADD_PROGRAMMING = "addProgramming";
const REMOVE_PROGRAMMING = "removeProgramming";
const GET_HTTPPER = "getHTTPCurrentPerformaceStatistics";
const GET_RBUSPER = "getRBUSCurrentPerformaceStatistics";
const GET_RBUSSTAT = "getRBUSStatistics";

const DISP_APP = "distinctApplications";
const local = false;

export default class HttpMonitor {
  constructor() {
    this.configuration = getConfiguration();
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
    return axios.get(this.getUrl(GET_CONFIGURATION, queryParams));
  }

  getProgramming(type) {
    let qType = "temp";
    if (type) qType = type === TypeProgramming.THEMP ? "temp" : "light";
    var queryParams = [{ key: "type", value: qType }];
    return axios.get(this.getUrl(GET_PROGRAMMING, queryParams));
  }

  addProgramming(type) {
    return axios.post(
      this.getUrl(ADD_PROGRAMMING),
      "data=" + JSON.stringify({"type" : type}),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded; charset=utf-8"
        }
      }
    );
  }
  // application/x-www-form-urlencoded
  updateConfiguration(conf) {
    return axios.post(
      this.getUrl(UPDATE_CONFIGURATION),
      "data=" + JSON.stringify(conf),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded; charset=utf-8"
        }
      }
    );
  }
}
