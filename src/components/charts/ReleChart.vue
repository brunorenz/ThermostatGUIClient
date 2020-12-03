<template>
  <div>
    <b-row>
      <b-col sm="7">
        <h4 id="traffic" class="card-title mb-1">Grafici Relè</h4>
        <h6 class="card-subtitle mb-0 text-muted">{{ intervallo }}</h6>
      </b-col>
      <b-col sm="5" class="d-none d-md-block">
        <ModalConfiguration
          :model="model"
          v-on:updateConfiguration="updateConfiguration"
        ></ModalConfiguration>
      </b-col>
    </b-row>
    <b-card v-for="dataCollection in dataCollections" :key="dataCollection.ix">
      <b-row>
        <b-col>
          <h6 class="card-title mb-1">
            {{ dataCollection.datasets[0].label }}
          </h6>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <LineCharts
            chartId="main-chart-01"
            class="chart-wrapper"
            style="height: 250px; margin-top: 20px"
            height="200"
            :chart-data="dataCollection"
            :options="options"
          ></LineCharts>
        </b-col>
      </b-row>
    </b-card>
  </div>
</template>

<script>
import moment from "moment";

import LineCharts from "@/components/charts/LineCharts";
//import HttpMonitor from "@/services/httpMonitorRest";
import ModalConfiguration from "@/components/common/ModalConfiguration";
import { setTimeout, clearTimeout, setImmediate } from "timers";
import { getStyle, hexToRgba } from "@coreui/coreui/dist/js/coreui-utilities";
import { createSingleGraphStructure } from "@/services/monitorGraph";
import { getConfiguration, getDefaultLineOptions } from "@/services/config";

import HttpManager from "@/common/services/HttpManager";
import { GET_R_STATISTICS, getServiceInfo } from "@/services/restServices";
import {
  showMsgEsitoEsecuzione,
  showMsgErroreEsecuzione,
  showConfirmationMessage,
} from "@/common/services/utilities";

export default {
  name: "ReleChart",
  components: {
    LineCharts,
    ModalConfiguration,
  },
  data: function () {
    return {
      selected: "hour",
      intervallo: "",
      showGraph: false,
      tmpModalData: { disable: false, windowsOpen: true },
      model: {
        title: "Configurazione Grafici Andamento Accensione Rele",
        fields: [],
      },
      configuration: {},
      tipoDispositivo: "",
      timerId: null,
      dataCollections: {},
      options: {},
      changeCfgState: {},
    };
  },
  created: function () {
    let name = `${this.$options.name}`;
    console.log("Create component " + name + " .. TIMER : " + this.timerId);
    this.tmpModalData.windowsOpen = true;
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
          max: 120,
        },
        {
          label: "Intervallo grafico Ora in minuti",
          type: "number",
          min: 1,
          max: 30,
        },
        {
          label: "Timeout in millisecondi",
          type: "number",
          min: 10000,
        },
        {
          label: "Andamento",
          type: "radio",
          options: [
            { text: "Ultima ora", value: "hour" },
            { text: "Giornalieri", value: "day" },
          ],
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
      console.log("Start immediate GetStatistics");
      setImmediate(this.getStatistics());
    },
    getStatistics() {
      console.log("Refresh statistics for " + this.tmpModalData.param.type);
      let info = getServiceInfo(GET_R_STATISTICS);
      var interval =
        this.tmpModalData.param.type === "hour"
          ? this.tmpModalData.param.hourInterval
          : this.tmpModalData.param.dayInterval;
      info.query.interval = interval;
      info.query.type = this.tmpModalData.param.type;
      new HttpManager()
        .callNodeServer(info)
        .then((response) => {
          var data = response.data;
          if (data.data) {
            var dati = data.data;
            var datiServers = [];
            // create dataset empty record
            let dataCollections = [];
            for (var i = 0; i < dati.length; i++) {
              let rele = dati[i];
              var label = [];
              let graphDataset = {
                label: rele.location,
                backgroundColor: "transparent",
                borderColor: "#24d654",
                pointHoverBackgroundColor: "#fff",
                borderWidth: 2,
              };
              let graphParams = {
                initialDate: new Date(rele.startTime),
                finalDate: new Date(rele.endTime),
                interval: interval,
              };
              var graph = createSingleGraphStructure(graphParams, true);
              for (let ix = 0; ix < graph.label.length; ix++) {
                var d = new Date(graph.label[ix]);
                var datestring =
                  ("0" + d.getHours()).slice(-2) +
                  ":" +
                  ("0" + d.getMinutes()).slice(-2);
                label.push(datestring);
              }
              let msInterval = interval * 1000 * 60;
              if (typeof rele.statistics != "undefined")
                for (let i = 0; i < rele.statistics.length; i++) {
                  var entry = rele.statistics[i].value;
                  var currentTime = rele.statistics[i].time;
                  let ixGD = (currentTime - rele.startTime) / msInterval;
                  try {
                    if (ixGD < graph.dati.length) {
                      graph.dati[ixGD] = entry.on / entry.tot / 2 > 0 ? 1 : 0;
                    } else console.err("INdice errato " + ixGD);
                  } catch (error) {
                    console.error(
                      "ixGD : " + ixGD + " msInterval : " + msInterval
                    );
                  }
                }
              graphDataset.data = graph.dati;
              dataCollections.push({
                ix: i,
                labels: label,
                datasets: [graphDataset],
              });
            }
            this.dataCollections = dataCollections;
            this.options = getDefaultLineOptions();
            this.intervallo = "Gruppi di " + interval + " minuti";
            this.options.title.text = this.intervallo;
            this.showGraph = true;
            if (this.tmpModalData.windowsOpen)
              this.timerId = setTimeout(
                this.getStatistics,
                this.tmpModalData.param.timeout
              );
          }
        })
        .catch((error) => {
          console.log("Error callig service 'getStatistics' : " + error);
          if (this.tmpModalData.windowsOpen)
            this.timerId = setTimeout(
              this.getHTTPStatistics,
              this.tmpModalData.timeout
            );
        });
    },
  },
};
</script>

<style>
/* IE fix */
#card-chart-01,
#card-chart-02 {
  width: 100% !important;
}
</style>
