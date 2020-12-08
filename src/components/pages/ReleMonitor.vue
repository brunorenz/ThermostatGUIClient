<template>
  <div v-if="tmpModalData.windowsOpen">
    <ViewLoading v-if="viewLoading" />
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
            <div v-if="datiServer.flagReleTemp === 1">
              <b-row>
                <b-col sm="8" class="text-left">Temperatura Misurata</b-col>
                <b-col class="text-right">
                  <strong>{{ datiServer.temperature }}</strong>
                </b-col>
              </b-row>
              <b-row>
                <b-col sm="8" class="text-left">Temperatura Programmata</b-col>
                <b-col class="text-right">
                  <strong>{{ datiServer.temperatureRif }}</strong>
                </b-col>
              </b-row>
            </div>
            <div v-if="datiServer.flagReleLight === 1">
              <b-row>
                <b-col sm="8" class="text-left">Luce Misurata</b-col>
                <b-col class="text-right">
                  <strong>{{ datiServer.currentLight }}</strong>
                </b-col>
              </b-row>
              <b-row>
                <b-col sm="8" class="text-left">Luce Minima Programmata</b-col>
                <b-col class="text-right">
                  <strong>{{ datiServer.currentLightRif }}</strong>
                </b-col>
              </b-row>
            </div>
          </b-col>
        </b-row>
      </b-col>
    </b-row>
    <b-modal
      v-model="tmpModalData.showUpdateModal"
      id="modalAggiornaStato"
      title="Aggiorna Stato Relè"
      no-close-on-backdrop
      @ok="updateStatus(true)"
      :ok-disabled="tmpModalData.disable"
    >
      <template v-slot:modal-footer="{ ok, cancel }">
        <div class="modal-body text-center p-0">
          <b-button
            class="ml-3 mt-1 mb-0 rounded-button small-button"
            data-dismiss="modal"
            @click="cancel()"
          >
            Annulla
          </b-button>
          <b-button
            class="ml-3 mt-1 mb-0 rounded-button small-button"
            data-dismiss="modal"
            @click="ok()"
            :disabled="!anyChange"
          >
            Conferma
          </b-button>
        </div>
      </template>
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
            <b-row>
              <b-form-radio class="mx-2" value="2">MANUALE</b-form-radio>
            </b-row>
            <b-row>
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
import { setTimeout, clearTimeout, setImmediate } from "timers";
import { getConfiguration, TypeStatus, checkSecurity } from "@/services/config";
//import router from "@/router";

import ViewLoading from "@/common/pages/ViewLoading";
import HttpManager from "@/common/services/HttpManager";
import {
  UPDATE_STATUS,
  GET_RELEDATA,
  getServiceInfo,
} from "@/services/restServices";
import {
  showMsgEsitoEsecuzione,
  showMsgErroreEsecuzione,
  showConfirmationMessage,
} from "@/common/services/utilities";
export default {
  name: "ReleMonitor",
  components: {
    ModalConfiguration,
    ViewLoading,
  },
  data: function () {
    return {
      statusLabel: undefined,
      viewLoading: false,
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
  computed: {
    anyChange: function () {
      let newStatus = this.tmpModalData.currentProg;
      let themp = this.tmpModalData.currentConfig.flagReleLight === 0;
      let oldStatus = themp ? this.tmpModalData.currentConfig.statusThermostat : this.tmpModalData.currentConfig.statusLight;
      return newStatus != oldStatus;
    },
  },
  created: function () {
    let name = `${this.$options.name}`;
    console.log("Create component " + name + " .. TIMER : " + this.timerId);
    this.statusLabel = {};
    this.statusLabel[TypeStatus.OFF] = "SPENTO";
    this.statusLabel[TypeStatus.ON] = "ACCESO";
    this.statusLabel[TypeStatus.MANUAL] = "MANUALE";
    this.statusLabel[TypeStatus.AUTO] = "AUTOMATICO";
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
    updateStatus(confirm) {
      if (confirm) {
        showConfirmationMessage(
          this,
          "Confermi l'aggiornamento ? ",
          this.updateStatus
        );
      } else {
        this.viewLoading = true;
        let info = getServiceInfo(UPDATE_STATUS);
        info.request = {
          macAddress: this.tmpModalData.currentConfig.macAddress,
          
        };
        let themp = this.tmpModalData.currentConfig.flagReleLight === 0;
        if (themp) info.request.statusThermostat = this.tmpModalData.currentProg;
        else info.request.statusLight = this.tmpModalData.currentProg;
        new HttpManager()
          .callNodeServer(info)
          .then((response) => {
            let dati = response.data;
            if (dati.error.code === 0) {
              showMsgEsitoEsecuzione(
                this,
                "Aggiornamento effettuato con successo"
              );
              this.getReleData();
            } else {
              showMsgErroreEsecuzione(this);
            }
            this.viewLoading = false;
          })
          .catch((error) => {
            showMsgErroreEsecuzione(this, error);
            this.viewLoading = false;
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
      this.tmpModalData.currentConfig = config;
      this.tmpModalData.currentProg =
        config.flagReleTemp === 1
          ? config.statusThermostat
          : config.statusLight;
      this.tmpModalData.showUpdateModal = true;
    },
    getReleData() {
      const httpService = new HttpManager();
      let info = getServiceInfo(GET_RELEDATA);
      httpService
        .callNodeServer(info)
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
                d.progType = this.statusLabel[d.statusThermostat];
                let t = data[ix].temperature;
                d.temperature = t.temperature.toFixed(2) + "°";
                d.temperatureRif = "N/A";
                if (d.statusThermostat === TypeStatus.MANUAL)
                  d.temperatureRif = t.minTempManual.toFixed(2) + "°";
                else if (d.statusThermostat === TypeStatus.AUTO)
                  d.temperatureRif = t.minTempAuto.toFixed(2) + "°";
                sd.push(d);
              } else if (d.flagReleLight === 1) {
                let t = data[ix].light;
                d.progType = this.statusLabel[d.statusLight];
                d.currentLight = t.currentLight.toFixed(2) + "%";
                d.currentLightRif = "N/A";
                if (d.statusLight === TypeStatus.AUTO)
                  d.currentLightRif = t.minLightAuto.toFixed(2) + "%";
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
          //this.tmpModalData.currentConfig = sd[0];
          //this.tmpModalData.currentProg = sd[0].statusThermostat;
          this.tmpModalData.windowsOpen = true;
        })
        .catch((error) => {
          showMsgErroreEsecuzione(this, error);
        });
    },
  },
};
</script>
