export const GET_SENSORDATA = "getSensorData";
export const GET_RELEDATA = "getReleData";

const METHOD = { POST: 1, GET: 2 };
import { getConfiguration } from "@/common/configuration";

let serviceDefinition = function(url, method) {
  return method === METHOD.POST ? serviceDefinitionPOST(url) : serviceDefinitionGET(url);
};

let serviceDefinitionPOST = function(url) {
  return {
    request: {},
    url: "p/" + url,
    method: "POST",
  };
};

let serviceDefinitionGET = function(url) {
  return {
    query: {},
    url: "g/" + url,
    method: "GET",
  };
};

const serviceConfiguration = {
  getSensorData: () => serviceDefinition(GET_SENSORDATA, METHOD.GET),
  getReleData: () => serviceDefinition(GET_RELEDATA, METHOD.GET),
};

export function getServiceInfo(serviceName) {
  let r = serviceConfiguration[serviceName];
  if (r === undefined) throw "Servizio " + serviceName + " non configurato!";
  return r();
}
