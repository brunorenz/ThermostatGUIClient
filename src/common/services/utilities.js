const { default: store } = require("@/store");

let showMsgEsitoEsecuzione = function(obj, message, warning) {
  let options = {
    title: "Esito Esecuzione Servizio",
    okVariant: "success",
    footerClass: "p-2 border-top-0",
    centered: true,
  };
  if (warning != undefined && warning) options.okVariant = "warning";
  obj.$bvModal
    .msgBoxOk(message, options)
    .then((value) => {})
    .catch((err) => {
      console.error("Errore in display msgbox : " + err);
    });
};

exports.showMsgEsitoEsecuzione = showMsgEsitoEsecuzione;

let showMsgErroreEsecuzione = function(obj, esito, funzione) {
  let msg = "";
  if (esito === undefined) {
    let error = store.getters.errorMessage;
    msg = "Servizio " + error.function + " : Return code : " + error.code + " , Message : " + error.message;
  } else if (esito instanceof Error) {
    msg = esito.message;
  } else {
    msg = esito;
    if (typeof esito != "undefined" && typeof esito.code != "undefined") {
      msg = "Return code : " + esito.code + " , Message : " + esito.message;
    }
    if (typeof funzione != "undefined") msg = "Servizio " + funzione + " : " + msg;
  }
  console.log(msg);
  let options = {
    title: "Errore Esecuzione Servizio",
    okVariant: "danger",
    footerClass: "p-2 border-top-0",
    centered: true,
  };
  obj.$bvModal
    .msgBoxOk(msg, options)
    .then((value) => {})
    .catch((err) => {
      console.error("Errore in display msgbox : " + err);
    });
};

exports.showMsgErroreEsecuzione = showMsgErroreEsecuzione;

let showConfirmationMessage = function(obj, message, operation, operationParameter) {
  let options = {
    title: "Conferma Operazione",
    okVariant: "success",
    cancelVariant: "danger",
    footerClass: "p-2 border-top-0",
    centered: true,
  };
  obj.$bvModal
    .msgBoxConfirm(message, options)
    .then((value) => {
      if (value) {
        if (operationParameter) operation(operationParameter);
        else operation();
      }
    })
    .catch((err) => {
      console.error("Errore in display msgbox : " + err);
    });
};

exports.showConfirmationMessage = showConfirmationMessage;
