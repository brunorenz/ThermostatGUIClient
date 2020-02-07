<template>
  <div class="animated fadeIn">
    <b-card>
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
            <b-col>
              {{ datiServer.location }}
              -
              {{ datiServer.lastAccessD }}
            </b-col>
          </b-row>
          <b-row>
            <b-col class="mb-sm-2 mb-0" v-if="datiServer.status === 0">
              <img src="img/icons8-pastel-64-off.png" />
            </b-col>
            <b-col class="mb-sm-2 mb-0" v-if="datiServer.status === 1">
              <img src="img/icons8-pastel-64-on.png" />
            </b-col>
            <b-col class="mb-sm-2 mb-0">
              Programmazione <br /><strong>{{ datiServer.progType }}</strong>
            </b-col>
          </b-row>
        </b-col>
      </b-row>
    </b-card>
  </div>
</template>

<script>
import moment from "moment";
import ModalConfiguration from "@/components/common/ModalConfiguration";
import HttpServer from "@/services/httpMonitorRest";
import { setTimeout, clearTimeout, setImmediate } from "timers";
import { getConfiguration, TypeStatus } from "@/services/config";

export default {
  name: "ReleMonitor",
  components: {
    ModalConfiguration
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
    this.getReleData();
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
      this.tmpModalData.timeout = 30000; //this.configuration.httpPerformace.timeout;
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
      console.log("Start immediate getReleData");
      setImmediate(this.getReleData());
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
    getReleData() {
      const httpService = new HttpServer();
      try {
        httpService
          .getReleData()
          .then(response => {
            let sd = [];
            let dati = response.data;
            if (dati.error.code === 0) {
              var data = dati.data;
              for (let ix = 0; ix < data.length; ix++) {
                let d = data[ix];
                // OFF: 0, ON: 1, MANUAL: 2, AUTO: 3
                if (d.flagReleTemp === 1) {
                  switch (d.temperatureMeasure) {
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
                }
                d.lastAccessD = moment(d.time).format("DD/MM/YYYY HH:mm");
                sd.push(d);
              }
            } else {
              console.log("Nessun dato da visualizzare");
            }
            this.datiServers = sd;
            this.timerId = setTimeout(
              this.getReleData,
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
