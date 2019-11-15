import axios from "axios";
import { getConfiguration } from "@/services/config";

const GET_CONFIGURATION = "getConfiguration";
const UPDATE_CONFIGURATION = "updateConfiguration";
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
  updateConfiguration(conf) {
    return axios.post(this.getUrl(UPDATE_CONFIGURATION), conf);
  }
  /*
  getStatistics(type, time, interval) {
    var queryParams = [];
    if (type) queryParams.push({ key: "type", value: type });
    var defInterval = 30;
    if (time) {
      queryParams.push({ key: "time", value: time });
      if (time === "hour") defInterval = 5;
    }
    if (interval) defInterval = interval;
    queryParams.push({ key: "interval", value: defInterval });
    return axios.get(this.getUrl(GET_STAT, queryParams));
  }

  getCurrentStatistics() {
    return this.getStatistics("all", "current");
  }

  getHTTPApplicationPerformaceStatistics(inputData) {
    var queryParams = [];
    queryParams.push({ key: "type", value: "app" });
    queryParams.push({ key: "interval", value: 0 });
    queryParams.push({ key: "time", value: inputData.time });
    if (typeof inputData.onlyKo !== "undefined")
      queryParams.push({
        key: "onlyKo",
        value: inputData.onlyKo
      });
    if (typeof inputData.avg !== "undefined")
      queryParams.push({ key: "avg", value: inputData.avg });
    return axios.get(this.getUrl(GET_STAT, queryParams));
  }

  getRBUSTrxStatistics(parent, onlyKo, avg, depth, channel) {
    var queryParams = [];
    if (typeof parent !== "undefined")
      queryParams.push({ key: "parent", value: parent });
    if (typeof onlyKo !== "undefined")
      queryParams.push({ key: "onlyKo", value: onlyKo });
    if (typeof avg !== "undefined")
      queryParams.push({ key: "avg", value: avg });
    if (typeof depth !== "undefined")
      queryParams.push({ key: "depth", value: depth });
    if (typeof channel !== "undefined")
      queryParams.push({ key: "channel", value: channel });
    return axios.get(this.getUrl(GET_RBUSSTAT, queryParams));
  }

  getHTTPCurrentPerformaceStatistics(timeDepth, detail) {
    var queryParams = [];
    if (typeof timeDepth !== "undefined")
      queryParams.push({ key: "timeDepth", value: timeDepth });
    if (typeof detail !== "undefined")
      queryParams.push({ key: "detail", value: detail });
    return axios.get(this.getUrl(GET_HTTPPER, queryParams));
  }

  getRBUSCurrentPerformaceStatistics(timeDepth, interval) {
    var queryParams = [];
    if (typeof timeDepth !== "undefined")
      queryParams.push({ key: "timeDepth", value: timeDepth });
    if (typeof interval !== "undefined")
      queryParams.push({ key: "interval", value: interval });
    queryParams.push({ key: "server", value: true });
    return axios.get(this.getUrl(GET_RBUSPER, queryParams));
  }
  */
}
