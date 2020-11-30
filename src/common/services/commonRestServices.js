export const LOGIN = "login";

const METHOD = { POST: 1, GET: 2 };
import { getConfiguration } from "@/services/config";

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

let login = function() {
  let r = serviceDefinitionPOST(LOGIN);
  r.baseUrl = getConfiguration().urlSecurity;
  return r;
};

const serviceConfiguration = {
  login,
};

export function getServiceInfo(serviceName) {
  let r = serviceConfiguration[serviceName];
  if (r === undefined) throw "Servizio " + serviceName + " non configurato!";
  return r();
}
