export const GET_SENSORDATA = "getSensorData";
export const GET_RELEDATA = "getReleData";
export const UPDATE_STATUS = "updateStatus";
export const GET_CONFIGURATION = "getDeviceConfiguration";
export const GET_PROGRAMMING = "getProgramming";
export const ADD_PROGRAMMING = "addProgramming";
export const DELETE_PROGRAMMING = "deleteProgramming";
export const UPDATE_PROGRAMMING = "updateProgramming";

const METHOD = { POST: 1, GET: 2 };

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
  updateStatus: () => serviceDefinition(UPDATE_STATUS, METHOD.POST),
  getDeviceConfiguration: () => serviceDefinition(GET_CONFIGURATION, METHOD.GET),
  getProgramming: () => serviceDefinition(GET_PROGRAMMING, METHOD.GET),
  addProgramming: () => serviceDefinition(ADD_PROGRAMMING, METHOD.POST),
  deleteProgramming: () => serviceDefinition(DELETE_PROGRAMMING, METHOD.POST),
  updateProgramming: () => serviceDefinition(UPDATE_PROGRAMMING, METHOD.POST),
};

export function getServiceInfo(serviceName) {
  let r = serviceConfiguration[serviceName];
  if (r === undefined) throw "Servizio " + serviceName + " non configurato!";
  return r();
}
