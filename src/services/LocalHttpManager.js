import axios from "axios";
import HttpManager from "@/common/services/HttpManager";
import { TypeAction, getConfiguration, TypeProgramming, SecurityConfiguration } from "@/services/config";
export default class LocalHttpManager extends HttpManager {
  constructor() {
    super();
    this.localConfiguration = getConfiguration();
  }

  getWeatherInfo() {
    let url = this.localConfiguration.weatherMonitor.weatherUrl;
    url = url + "&id=" + this.localConfiguration.weatherMonitor.id;
    console.log("Call " + url);
    return this.getMainAxios().get(url, {});
  }
}
