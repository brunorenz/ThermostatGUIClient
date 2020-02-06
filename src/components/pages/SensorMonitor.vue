<template>
  <div class="animated fadeIn">
    <b-card>
      <b-row>
        <b-col sm="7">
          <h4 id="traffic" class="card-title mb-1">
            Richieste HTTP Server WEB
          </h4>
          <h6 class="card-subtitle mb-0 text-muted">
            Ultimi {{ this.tmpModalData.depth }} secondi
          </h6>
        </b-col>
        <b-col sm="5" class="d-none d-md-block">
          <ModalConfiguration
            :model="model"
            v-on:updateConfiguration="updateConfiguration"
          ></ModalConfiguration>
        </b-col>
      </b-row>
      <b-row class="text-center">
        <b-col
          class="mb-sm-2 mb-0"
          v-for="datiServer in datiServers"
          :key="datiServer.name"
        >
          <div>{{ datiServer.label }}</div>
          <strong
            >{{ datiServer.tot }} Request ({{ datiServer.perServer }}%)</strong
          >
          <b-progress
            height="{}"
            class="progress-xs mt-2"
            :precision="1"
            variant="success"
            :value="datiServer.ok"
          ></b-progress>
          <b-progress
            height="{}"
            class="progress-xs mt-2"
            :precision="1"
            variant="danger"
            :value="datiServer.ko"
          ></b-progress>
        </b-col>
      </b-row>
    </b-card>
  </div>
</template>

<script>
import moment from "moment";
import ModalConfiguration from "@/components/common/ModalConfiguration";
import { setTimeout, clearTimeout, setImmediate } from "timers";
import {
  getConfiguration,
  getInitialHTTPGraphConfiguration
} from "@/services/config";

export default {
  name: "SensorMonitor",
  components: {
    ModalConfiguration
  },
  data: function() {
    return {
      configuration: {},
      timerId: null,
      datiServers: [],
      tmpModalData: { disable: false, windowsOpen: true },
      model: {
        title: "Configurazione Grafici Sensori",
        fields: []
      }
    };
  },
  created: function() {
    let name = `${this.$options.name}`;
    console.log("Create component " + name + " .. TIMER : " + this.timerId);
    this.tmpModalData.windowsOpen = true;
  },
  beforeDestroy: function() {
    let name = `${this.$options.name}`;
    console.log("Destroy component " + name + " .. ");
    clearTimeout(this.timerId);
    this.timerId = null;
    this.tmpModalData.windowsOpen = false;
  },
  beforeMount: function() {
    console.log("Load configuration..");
    this.configuration = getConfiguration();
    this.resetConfiguration();
  },
  mounted: function() {
    this.getSensorData();
  },
  methods: {
    updateConfiguration(model) {
      if (model.length) {
        for (var ix = 0; ix < model.length; ix++) {
          // valuta ix
          var entry = model[ix];
          switch (entry.id) {
            case "ID0":
              this.tmpModalData.depth = entry.value;
              break;
            case "ID1":
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
      this.model.fields[0].value = this.tmpModalData.depth;
      this.model.fields[1].value = this.tmpModalData.timeout;
      for (var ix = 0; ix < this.model.fields.length; ix++) {
        this.model.fields[ix].id = "ID" + ix;
        this.model.fields[ix].state = true;
      }
    },
    resetConfiguration() {
      console.log("reset configuration");
      this.tmpModalData.depth = this.configuration.httpPerformace.depth;
      this.tmpModalData.timeout = this.configuration.httpPerformace.timeout;
      this.model.fields = [
        {
          label: "Profondità in secondi",
          type: "number",
          min: 10,
          max: 120
        },
        {
          label: "Timeout in millisecondi",
          type: "number",
          min: 2000
        }
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
      console.log("Start immediate GetSensorData");
      setImmediate(this.getSensorData());
    },
    variant(value) {
      let $variant;
      if (value <= 25) {
        $variant = "info";
      } else if (value > 25 && value <= 50) {
        $variant = "success";
      } else if (value > 50 && value <= 75) {
        $variant = "warning";
      } else if (value > 75 && value <= 100) {
        $variant = "danger";
      }
      return $variant;
    },
    flag(value) {
      return "flag-icon flag-icon-" + value;
    },
    getSensorData() {
      const httpService = new HttpServer();
      try {
        httpService
          .getConfiguration()
          .then(response => {
            let dati = response.data;
            if (dati.error.code === 0) {
              this.elencoDispositiviOrig = dati.data;
              this.elencoDispositivi = JSON.parse(JSON.stringify(dati.data));
              var data = dati.data;
              let ed = [];
              ed.push({
                value: null,
                text: "Seleziona un dispositivo"
              });
              for (let ix = 0; ix < data.length; ix++) {
                ed.push({
                  value: ix,
                  text: data[ix].location + "(" + data[ix].macAddress + ")"
                });
                let deviceName = "NON DEFINITO";
                switch (data[ix].deviceType) {
                  case 1:
                    deviceName = "ARDUINO";
                    break;
                  case 2:
                    deviceName = "SHELLY";
                    if (this.elencoDispositivi[ix].flagReleTemp === 1)
                      this.elencoDispositivi[ix].tipoRele = "1";
                    else if (this.elencoDispositivi[ix].flagReleLight === 1)
                      this.elencoDispositivi[ix].tipoRele = "2";
                    else this.elencoDispositivi[ix].tipoRele = "0";
                    break;
                }
                // propago in copia
                this.elencoDispositiviOrig[
                  ix
                ].tipoRele = this.elencoDispositivi[ix].tipoRele;
                this.elencoDispositivi[ix].deviceTypeName = deviceName;
                this.elencoDispositivi[ix].lastAccessD = moment(
                  data[ix].lastAccess
                ).format("DD/MM/YYYY HH:mm");
                this.elencoDispositivi[ix].lastUpdateD = moment(
                  data[ix].lastUpdate
                ).format("DD/MM/YYYY HH:mm");
                this.elencoDispositivi[ix].lastCheckD = moment(
                  data[ix].lastCheck
                ).format("DD/MM/YYYY HH:mm");
              }
              if (data.length === 1) {
                this.showListDispositivi = false;
                this.showDispositivo = true;
                this.showDettaglioDispositivo(0);
              } else {
                this.optionsElencoDispositivi = ed;
                this.showListDispositivi = true;
                this.showDispositivo = false;
              }
            } else {
              console.log("Nessun dato da visualizzare");
            }
            this.disableAggiorna = true;
          })
          .catch(error => {
            console.log("Error callig service 'getConfiguration' : " + error);
            this.showMsgConfermaEsecuzione(
              "Servizio non disponibile : " + error
            );
          });
      } catch (error) {
        this.showMsgConfermaEsecuzione("Servizio non disponibile : " + error);
      }
    }
  }
};
</script>
