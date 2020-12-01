const local = true;
const remoteNodeServer = true;
const urlApp = process.env.VUE_APP_URL_MAIN;
const urlSecurity = process.env.VUE_APP_URL_SECURITY;
const serverUrlP = "/";
const serverUrlRemote = remoteNodeServer ? "https://therm.65bruno.it/" : "http://192.168.0.101:8101/";
const serverUrlD = local ? "http://localhost:8101/" : serverUrlRemote;

let configuration = {
  serverUrl: process.env.NODE_ENV === "production" ? serverUrlP : serverUrlD,
  urlApp: urlApp,
  urlSecurity: urlSecurity,
};

export function getConfiguration() {
  return JSON.parse(JSON.stringify(configuration));
}
