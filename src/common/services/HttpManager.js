import { mainAxios } from "@/common/services/axiosInstance";
import { getConfiguration } from "@/common/configuration";
import { SecurityConfiguration } from "@/common/services/security";

let validateRequest = function(serviceContext) {};

export default class HttpManager {
  constructor() {
    this.configuration = getConfiguration();
  }

  getPostJsonSecurityHeader(auth) {
    let headers = {
      "Content-Type": "application/json; charset=utf-8",
    };
    if (typeof auth === "undefined") auth = true;
    return this._getSecurityHeader(headers, auth);
  }

  getPostSecurityHeader(auth) {
    let headers = {
      "Content-Type": "application/x-www-form-urlencoded; charset=utf-8",
    };
    if (typeof auth === "undefined") auth = true;
    return this._getSecurityHeader(headers, auth);
  }

  getGetSecurityHeader(auth) {
    return this._getSecurityHeader({}, auth);
  }

  _getSecurityHeader(headers, auth) {
    if (typeof headers === "undefined") headers = {};
    if (SecurityConfiguration.basicAuthRequired) {
      headers.Authorization = SecurityConfiguration.basicAuth;
    }
    return headers;
  }

  getUrl(functionUrl, queryParams, url) {
    if (typeof url === "undefined") url = this.configuration.urlApp;
    var outUrl = this.configuration.serverUrl + url + functionUrl;
    if (queryParams) {
      let key = Object.keys(queryParams);
      if (key != undefined) {
        outUrl += "?";
        for (let ix = 0; ix < key.length; ix++) {
          if (ix === 0) outUrl += key[ix] + "=" + queryParams[key[ix]];
          else outUrl += "&" + key[ix] + "=" + queryParams[key[ix]];
        }
      }
    }
    console.log("HttpManager : Call " + outUrl);
    return outUrl;
  }

  async callAsyncNodeServer(serviceInfo) {
    return await this.callNodeServer(serviceInfo);
  }

  callNodeServer(serviceInfo) {
    let url = this.getUrl(serviceInfo.url, serviceInfo.query, serviceInfo.baseUrl);
    let auth = true;
    if (serviceInfo.auth != undefined) auth = serviceInfo.auth;
    let usePost = false;
    if (serviceInfo.method != undefined) usePost = serviceInfo.method === "POST" ? true : false;
    try {
      validateRequest(serviceInfo.request);
    } catch (error) {
      console.log("ServiceContext non presente..");
    }
    if (usePost) {
      return mainAxios.post(url, JSON.stringify(serviceInfo.request), {
        headers: this.getPostJsonSecurityHeader(auth),
        withCredentials: true,
      });
    } else {
      return mainAxios.get(url, {
        headers: this.getGetSecurityHeader(auth),
        withCredentials: true,
      });
    }
  }
}
