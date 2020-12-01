<template>
  <div v-if="tmpModalData.windowsOpen">
    <b-row>
      <b-col sm="9">
        <h4 id="traffic" class="card-title mb-1">Relè</h4>
      </b-col>
      <b-col sm="3" class="d-none d-md-block">
        <ModalConfiguration
          :model="model"
          v-on:updateConfiguration="updateConfiguration"
        ></ModalConfiguration>
      </b-col>
    </b-row>
    <b-row
      class="text-center"
      v-for="datiServer in datiServers"
      :key="datiServer.shellyId"
    >
      <b-col>
        <b-row>
          <b-col class="text-left" sm="8">
            <strong>{{ datiServer.location }}</strong>
          </b-col>
          <b-col class="text-right">
            <strong>{{ datiServer.lastAccessD }}</strong>
          </b-col>
        </b-row>
        <b-row>
          <b-col sm="3" v-if="datiServer.status === 0">
            <img
              src="img/icons8-pastel-64-off.png"
              @click="programSwitch(datiServer)"
            />
          </b-col>
          <b-col sm="3" v-if="datiServer.status === 1">
            <img
              src="img/icons8-pastel-64-on.png"
              @click="programSwitch(datiServer)"
            />
          </b-col>

          <b-col sm="9">
            <b-row>
              <b-col sm="7" class="text-left">Stato</b-col>
              <b-col class="text-right">
                <strong>{{ datiServer.progType }}</strong>
              </b-col>
            </b-row>
            <b-row v-if="datiServer.flagReleTemp === 1">
              <b-col sm="8" class="text-left">Temperatura Misurata</b-col>
              <b-col class="text-right">
                <strong>{{ datiServer.temperature }}</strong>
              </b-col>
            </b-row>
            <b-row v-if="datiServer.flagReleTemp === 1">
              <b-col sm="8" class="text-left">Temperatura Programmata</b-col>
              <b-col class="text-right">
                <strong>{{ datiServer.temperatureRif }}</strong>
              </b-col>
            </b-row>
            <b-row v-if="datiServer.flagReleLight === 1">
              <b-col sm="8" class="text-left">Luce Misurata</b-col>
              <b-col class="text-right">
                <strong>{{ datiServer.currentLight }}</strong>
              </b-col>
            </b-row>
            <b-row v-if="datiServer.flagReleLight === 1">
              <b-col sm="8" class="text-left">Luce Minima Programmata</b-col>
              <b-col class="text-right">
                <strong>{{ datiServer.currentLightRif }}</strong>
              </b-col>
            </b-row>
          </b-col>
        </b-row>
      </b-col>
    </b-row>
    <b-modal
      v-model="tmpModalData.showUpdateModal"
      id="modalAggiornaStato"
      title="Aggiorna Stato Relè"
      @ok="updateStatus"
      :ok-disabled="tmpModalData.disable"
    >
      <b-form-group label-cols-lg="6" label="Imposta tipo programma">
        <div sm="1">
          <b-form-radio-group
            id="idXX"
            v-model="tmpModalData.currentProg"
            placeholder="Imposta stato Relè"
          >
            <b-row>
              <b-form-radio class="mx-2" value="0">SPENTO</b-form-radio>
            </b-row>
            <b-row>
              <b-form-radio class="mx-2" value="1">ACCESO</b-form-radio>
            </b-row>
            <b-row v-if="tmpModalData.currentConfig.flagReleTemp === 1">
              <b-form-radio class="mx-2" value="2">MANUALE</b-form-radio>
            </b-row>
            <b-row v-if="tmpModalData.currentConfig.flagReleTemp === 1">
              <b-form-radio class="mx-2" value="3">AUTOMATICO</b-form-radio>
            </b-row>
          </b-form-radio-group>
        </div>
      </b-form-group>
    </b-modal>
  </div>
</template>

<script>
import moment from "moment";
import ModalConfiguration from "@/components/common/ModalConfiguration";
import HttpServer from "@/services/httpMonitorRest";
import { setTimeout, clearTimeout, setImmediate } from "timers";
import { getConfiguration, TypeStatus, checkSecurity } from "@/services/config";
import router from "@/router";

import HttpManager from "@/common/services/HttpManager";
import { GET_RELEDATA, getServiceInfo } from "@/services/restServices";

export default {
  name: "ReleMonitor",
  components: {
    ModalConfiguration,
  },
  data: function () {
    return {
      timerId: null,
      datiServers: [],
      tmpModalData: {
        disable: false,
        windowsOpen: false,
        showUpdateModal: false,
        currentProg: 0,
      },
      model: {
        title: "Configurazione Grafici Sensori",
        fields: [],
      },
    };
  },
  created: function () {
    let name = `${this.$options.name}`;
    console.log("Create component " + name + " .. TIMER : " + this.timerId);
    //this.tmpModalData.windowsOpen = true;
  },
  beforeDestroy: function () {
    let name = `${this.$options.name}`;
    console.log("Destroy component " + name + " .. ");
    clearTimeout(this.timerId);
    this.timerId = null;
    this.tmpModalData.windowsOpen = false;
  },
  beforeMount: function () {
    console.log("Load configuration..");
    this.configuration = getConfiguration();
    this.resetConfiguration();
  },
  mounted: function () {
    this.getReleData();
  },
  methods: {
    updateStatus(model) {
      let macAddress = this.tmpModalData.currentConfig.macAddress;
      let newStatus = this.tmpModalData.currentProg;
      let oldStatus = this.tmpModalData.currentConfig.statusThermostat;
      if (newStatus != oldStatus) {
        this.$bvModal
          .msgBoxConfirm("Confermi l'aggiornamento ?")
          .then((value) => {
            if (value) {
              const httpService = new HttpServer();
              httpService
                .updateStatus({
                  macAddress: macAddress,
                  statusThermostat: newStatus,
                })
                .then((response) => {
                  let dati = response.data;
                  if (dati.error.code === 0) {
                    this.showMsgConfermaEsecuzione(
                      "Aggiornamento effettuato con successo"
                    );
                    this.getReleData();
                  } else {
                    this.showMsgConfermaEsecuzione(
                      "Errore in fase di aggiornamento : " + dati.error.message
                    );
                  }
                })
                .catch((error) => {
                  this.showMsgConfermaEsecuzione(
                    "Errore in fase di aggiornamento : " + error
                  );
                });
            }
          })
          .catch((err) => {
            // An error occurred
          });
      }
    },
    updateConfiguration(model) {
      if (model.length) {
        for (var ix = 0; ix < model.length; ix++) {
          // valuta ix
          var entry = model[ix];
          switch (entry.id) {
            case "ID0":
              this.tmpModalData.timeout = entry.value;
              break;
          }
        }
        this.refreshConfiguration();
        console.log(
          "update configuration : " + JSON.stringify(this.tmpModalData)
        );
        this.restartTimer();
      }
    },
    refreshConfiguration() {
      console.log("refresh configuration");
      this.model.fields[0].value = this.tmpModalData.timeout;
      for (var ix = 0; ix < this.model.fields.length; ix++) {
        this.model.fields[ix].id = "ID" + ix;
        this.model.fields[ix].state = true;
      }
    },
    resetConfiguration() {
      console.log("reset configuration");
      this.tmpModalData.timeout = this.configuration.releStatus.timeout;
      this.model.fields = [
        {
          label: "Timeout in millisecondi",
          type: "number",
          min: 10000,
        },
      ];
      this.refreshConfiguration();
    },
    getServerIndex(serverName) {
      for (let y = 0; y < this.configuration.server.length; y++)
        if (this.configuration.server[y].name === serverName) return y;
      return -1;
    },
    restartTimer() {
      console.log("Clear Timer ID = " + this.timerId);
      clearTimeout(this.timerId);
      console.log("Start immediate getReleData");
      setImmediate(this.getReleData());
    },
    programSwitch(config) {
      checkSecurity(router);
      this.tmpModalData.currentConfig = config;
      this.tmpModalData.currentProg =
        config.flagReleTemp === 1
          ? config.statusThermostat
          : config.statusLight;
      this.tmpModalData.showUpdateModal = true;
    },
    showMsgConfermaEsecuzione(message) {
      this.$bvModal
        .msgBoxOk(message, {
          //          title: "Please Confirm",
          //          okVariant: "danger"
        })
        .then((value) => {})
        .catch((err) => {
          // An error occurred
        });
    },
    getReleData() {
      const httpService = new HttpManager();
      let info = getServiceInfo(GET_RELEDATA);
      httpService
        .callNodeServer(info)
        .then((response) => {
          let dati = response.data;
          if (dati.error.code === 0) {
            debugger;
          } else {
            showMsgErroreEsecuzione(this);
          }
        })
        .catch((error) => {
          showMsgErroreEsecuzione(this, error);
        });
    },
    getReleDataOld() {
      const httpService = new HttpServer();
      try {
        httpService
          .getReleData()
          .then((response) => {
            let sd = [];
            let dati = response.data;
            if (dati.error.code === 0) {
              var data = dati.data;
              for (let ix = 0; ix < data.length; ix++) {
                let out = {};
                let d = data[ix].configuration;
                d.shellyId = d.shellyMqttId;
                d.status = data[ix].shelly.status;
                d.lastAccessD = moment(d.time).format("DD/MM/YYYY HH:mm");
                if (d.flagReleTemp === 1) {
                  // OFF: 0, ON: 1, MANUAL: 2, AUTO: 3
                  let t = data[ix].temperature;
                  d.temperature = t.temperature.toFixed(2) + "°";
                  d.temperatureRif = "N/A";
                  switch (d.statusThermostat) {
                    case TypeStatus.OFF:
                      d.progType = "SPENTO";
                      break;
                    case TypeStatus.ON:
                      d.progType = "ACCESO";
                      break;
                    case TypeStatus.MANUAL:
                      d.progType = "MANUALE";
                      d.temperatureRif = t.minTempManual.toFixed(2) + "°";
                      break;
                    case TypeStatus.AUTO:
                      d.progType = "AUTOMATICO";
                      d.temperatureRif = t.minTempAuto.toFixed(2) + "°";
                      break;
                  }
                  sd.push(d);
                } else if (d.flagReleLight === 1) {
                  let t = data[ix].light;
                  d.currentLight = t.currentLight.toFixed(2) + "%";
                  d.currentLightRif = t.minLightAuto.toFixed(2) + "%";
                  switch (d.statusLight) {
                    case TypeStatus.OFF:
                      d.progType = "SPENTO";
                      break;
                    case TypeStatus.ON:
                      d.progType = "ACCESO";
                      break;
                    case TypeStatus.MANUAL:
                      d.progType = "MANUALE";
                      break;
                    case TypeStatus.AUTO:
                      d.progType = "AUTOMATICO";
                      break;
                  }

                  sd.push(d);
                }
              }
            } else {
              console.log("Nessun dato da visualizzare");
            }
            this.datiServers = sd;
            this.timerId = setTimeout(
              this.getReleData,
              this.tmpModalData.timeout
            );
            this.tmpModalData.currentConfig = sd[0];
            this.tmpModalData.currentProg = sd[0].statusThermostat;
            this.tmpModalData.windowsOpen = true;
          })
          .catch((error) => {
            this.showMsgConfermaEsecuzione(
              "Servizio non disponibile : " + error
            );
          });
      } catch (error) {
        this.showMsgConfermaEsecuzione("Servizio non disponibile : " + error);
      }
    },
  },
};
</script>
