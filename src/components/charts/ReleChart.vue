<template>
  <div class="animated fadeIn">
    <b-card>
      <b-row>
        <b-col sm="7">
          <h4 id="traffic" class="card-title mb-1">
            Andamento Accensione {{ tipoDispositivo }}
          </h4>
          <h6 class="card-subtitle mb-0 text-muted">{{ intervallo }}</h6>
        </b-col>
        <b-col sm="5" class="d-none d-md-block">
          <ModalConfiguration
            :model="model"
            v-on:updateConfiguration="updateConfiguration"
          ></ModalConfiguration>
        </b-col>
      </b-row>
      <!--   v-for="entry in tmpData.prog" :key="entry.id">-->
      <b-row sm="12">
        <div v-if="showGraph">
          <LineCharts
            chartId="main-chart-01"
            class="chart-wrapper"
            style="height:250px;margin-top:00px;"
            height="250"
            :chart-data="dataCollection"
            :options="options"
          ></LineCharts>
        </div>
      </b-row>
    </b-card>
  </div>
</template>

<script>
import moment from "moment";

import LineCharts from "@/components/charts/LineCharts";
import HttpMonitor from "@/services/httpMonitorRest";
import ModalConfiguration from "@/components/common/ModalConfiguration";
import { setTimeout, clearTimeout, setImmediate } from "timers";
import { getStyle, hexToRgba } from "@coreui/coreui/dist/js/coreui-utilities";
import {
  createGraphStructure,
  getGraphStructureIndex
} from "@/services/monitorGraph";
import {
  getConfiguration,
  getDefaultLineOptions,
  getInitialHTTPGraphConfiguration
} from "@/services/config";

export default {
  name: "ReleChart",
  components: {
    LineCharts,
    ModalConfiguration
  },
  data: function() {
    return {
      selected: "hour",
      intervallo: "",
      showGraph: false,
      tmpModalData: { disable: false, windowsOpen: true },
      model: {
        title: "Configurazione Grafici Andamento Accensione Rele",
        fields: []
      },
      configuration: {},
      tipoDispositivo: "",
      timerId: null,
      dataCollection: {},

      dataCollectionWeb: {},
      dataCollectionApp: {},
      options: {},

      datiServers: [],
      //radiosBtnDisable: false,
      changeCfgState: {}
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
    this.getStatistics();
  },
  methods: {
    updateConfiguration(model) {
      if (model.length) {
        for (var ix = 0; ix < model.length; ix++) {
          // valuta ix
          var entry = model[ix];
          switch (entry.id) {
            case "ID0":
              this.tmpModalData.param.dayInterval = entry.value;
              break;
            case "ID1":
              this.tmpModalData.param.hourInterval = entry.value;
              break;
            case "ID2":
              this.tmpModalData.param.timeout = entry.value;
              break;
            case "ID3":
              this.tmpModalData.param.type = entry.value;
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
      this.model.fields[0].value = this.tmpModalData.param.dayInterval;
      this.model.fields[1].value = this.tmpModalData.param.hourInterval;
      this.model.fields[2].value = this.tmpModalData.param.timeout;
      this.model.fields[3].value = this.tmpModalData.param.type;
      for (var ix = 0; ix < this.model.fields.length; ix++) {
        this.model.fields[ix].id = "ID" + ix;
        this.model.fields[ix].state = true;
      }
    },

    resetConfiguration() {
      console.log("reset configuration");
      this.tmpModalData.param = this.configuration.releStatistics;
      this.model.fields = [
        {
          label: "Intervallo grafico Giorno in minuti",
          type: "number",
          min: 10,
          max: 120
        },
        {
          label: "Intervallo grafico Ora in minuti",
          type: "number",
          min: 1,
          max: 30
        },
        {
          label: "Timeout in millisecondi",
          type: "number",
          min: 10000
        },
        {
          label: "Andamento",
          type: "radio",
          options: [
            { text: "Ultima ora", value: "hour" },
            { text: "Giornalieri", value: "day" }
          ]
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
      console.log("Start immediate GetStatistics");
      setImmediate(this.getStatistics());
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
    getStatistics() {
      console.log("Refresh statistics for " + this.selected);
      //this.radiosBtnDisable = true;
      const httpService = new HttpMonitor();
      var interval =
        this.selected === "hour"
          ? this.tmpModalData.param.hourInterval
          : this.tmpModalData.param.dayInterval;
      httpService
        .getStatistics("RELE", this.selected, interval)
        .then(response => {
          var data = response.data;
          var label = [];
          if (data.data) {
            var dati = data.data;
            var conf = data.data.configurazione;
            var graphDataset = [];
            var datiServers = []; // getInitialHTTPGraphConfiguration();
            // create dataset empty record
            var ixGraph = [];
            for (var i = 0; i < datiServers.length; i++) {
              graphDataset.push({
                label: "Richieste " + datiServers[i].label,
                backgroundColor: "transparent",
                borderColor: this.configuration.server[i].color,
                pointHoverBackgroundColor: "#fff",
                borderWidth: 2,
                serverName: datiServers[i].name,
                serverType: datiServers[i].type
              });
              ixGraph.push(-1);
            }
            let graphParams = {
              initialDate: new Date(conf.infDate),
              finalDate: new Date(conf.supDate),
              interval: conf.interval,
              servers: conf.servers
            };
            var graph = createGraphStructure(graphParams, true);
            // creo indice grafico rispetto out servizio
            for (let i = 0; i < graph.length; i++) {
              let y = this.getServerIndex(graph[i].server);
              if (y >= 0) ixGraph[y] = i;
            }
            let initialDate = new Date(conf.infDate).getTime();
            let msInterval = conf.interval * 1000 * 60;
            for (let i = 0; i < dati.length; i++) {
              var entry = dati[i].value;
              var key = dati[i].key;
              let ix = this.getServerIndex(key.server);
              if (ix >= 0) {
                let serverInfo = graphParams.servers[ix];
                let ixG = ixGraph[ix];
                if (ixG >= 0) {
                  let ixGD =
                    (new Date(key.time).getTime() - initialDate) / msInterval;
                  try {
                    if (ixGD < graph[ixG].dati.length) {
                      graph[ixG].dati[ixGD].value = entry.num;
                    }
                  } catch (error) {
                    console.error(
                      "ixG : " +
                        ixG +
                        " - " +
                        "ixGD : " +
                        ixGD +
                        " msInterval : " +
                        msInterval
                    );
                  }
                }
              }
              // Creo Struttura output

              for (let i = 0; i < graphDataset.length; i++) {
                let ixG = ixGraph[i];
                if (ixG >= 0) {
                  let values = graph[ixG].dati;
                  let datiG = [];
                  for (let y = 0; y < values.length; y++) {
                    datiG.push(values[y].value);
                  }
                  if (label.length === 0) {
                    for (let y = 0; y < values.length; y++) {
                      var d = new Date(
                        new Date(values[y].time).getTime() + msInterval
                      );
                      var datestring =
                        ("0" + d.getHours()).slice(-2) +
                        ":" +
                        ("0" + d.getMinutes()).slice(-2);
                      label.push(datestring);
                    }
                  }
                  graphDataset[i].data = datiG;
                }
              }
            }
            var graphDatasetWEB = [];
            var graphDatasetAPP = [];
            for (var i = 0; i < graphDataset.length; i++)
              if (graphDataset[i].serverType === "APP")
                graphDatasetAPP.push(graphDataset[i]);
              else graphDatasetWEB.push(graphDataset[i]);
            this.dataCollectionWeb = {
              labels: label,
              datasets: graphDatasetWEB
            };
            this.dataCollectionApp = {
              labels: label,
              datasets: graphDatasetAPP
            };
            this.options = getDefaultLineOptions();
            this.intervallo = "Gruppi di " + conf.interval + " minuti";
            if (conf.supDate)
              this.intervallo =
                this.intervallo +
                " " +
                moment(conf.supDate).format("DD/MM/YYYY HH:mm:ss");
            this.options.title.text = this.intervallo;
            this.showGraph = true;
            if (this.tmpModalData.windowsOpen)
              this.timerId = setTimeout(
                this.getHTTPStatistics,
                this.tmpModalData.timeout
              );
            //this.radiosBtnDisable = false;
          }
        })
        .catch(error => {
          console.log("Error callig service 'getStatistics' : " + error);
          if (this.tmpModalData.windowsOpen)
            this.timerId = setTimeout(
              this.getHTTPStatistics,
              this.tmpModalData.timeout
            );
          //this.radiosBtnDisable = false;
        });
    }
  }
};
</script>

<style>
/* IE fix */
#card-chart-01,
#card-chart-02 {
  width: 100% !important;
}
</style>
