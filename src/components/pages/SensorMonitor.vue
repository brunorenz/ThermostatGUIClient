<template>
  <div class="animated fadeIn">
    <b-row>
      <b-col sm="9">
        <h4 class="card-title mb-1">Sensori</h4>
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
      :key="datiServer.macAddress"
    >
      <b-col>
        <b-row>
          <b-col>
            <strong
              >{{ datiServer.location }}
              -
              {{ datiServer.lastAccessD }}</strong
            >
          </b-col>
        </b-row>
        <b-row>
          <b-col class="mb-sm-2 mb-0">
            <div>
              <strong>
                Temperatura
                {{ datiServer.temperature }}°
              </strong>
            </div>
            <VueSvgGauge
              :start-angle="-60"
              :end-angle="60"
              :value="datiServer.temperature"
              :separator-step="0"
              :min="0"
              :max="40"
              :gauge-color="[
                { offset: 0, color: '#0000FF' },
                { offset: 40, color: '#FF0000' }
              ]"
              :scale-interval="1"
            />
          </b-col>
          <b-col class="mb-sm-2 mb-0">
            <div>
              <strong>
                Luce
                {{ datiServer.light }}%
              </strong>
            </div>
            <VueSvgGauge
              :start-angle="-60"
              :end-angle="60"
              :value="datiServer.light"
              :separator-step="0"
              :min="0"
              :max="100"
              :gauge-color="[
                { offset: 0, color: '#FFFFFF' },
                { offset: 100, color: '#FFFF00' }
              ]"
              :scale-interval="2"
            />
          </b-col>
        </b-row>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import { VueSvgGauge } from "vue-svg-gauge";
import moment from "moment";
import ModalConfiguration from "@/components/common/ModalConfiguration";
import HttpServer from "@/services/httpMonitorRest";
import { setTimeout, clearTimeout, setImmediate } from "timers";
import {
  getConfiguration,
  getInitialHTTPGraphConfiguration
} from "@/services/config";

export default {
  name: "SensorMonitor",
  components: {
    ModalConfiguration,
    VueSvgGauge
  },
  data: function() {
    return {
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
      this.tmpModalData.depth = 1;
      this.tmpModalData.timeout = this.configuration.sensorStatus.timeout;
      this.model.fields = [
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
    showMsgConfermaEsecuzione(message) {
      this.$bvModal
        .msgBoxOk(message, {
          //          title: "Please Confirm",
          //          okVariant: "danger"
        })
        .then(value => {})
        .catch(err => {
          // An error occurred
        });
    },
    getSensorData() {
      const httpService = new HttpServer();
      try {
        httpService
          .getSensorData()
          .then(response => {
            let sd = [];
            let dati = response.data;
            if (dati.error.code === 0) {
              var data = dati.data;
              for (let ix = 0; ix < data.length; ix++) {
                let d = data[ix];
                d.temperature = Math.floor(d.temperature * 100) / 100;
                d.light = Math.floor(d.light * 100) / 100;

                //
                sd.push(d);
                d.lastAccessD = moment(d.time).format("DD/MM/YYYY HH:mm");
              }
            } else {
              console.log("Nessun dato da visualizzare");
            }
            this.datiServers = sd;
            this.timerId = setTimeout(
              this.getSensorData,
              this.tmpModalData.timeout
            );
          })
          .catch(error => {
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