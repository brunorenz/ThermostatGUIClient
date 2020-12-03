<template>
  <div class="animated fadeIn">
    <b-row>
      <b-col sm="7">
        <h4 id="traffic" class="card-title mb-1">Grafici Sensori</h4>
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
    <b-card v-if="showGraphBase">
      <b-row>
        <b-col>
          <h6 class="card-title mb-1">Temperatura e Luce</h6>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <LineCharts
            chartId="main-chart-01"
            class="chart-wrapper"
            style="height: 250px; margin-top: 20px"
            height="200"
            :chart-data="dataCollectionT"
            :options="options"
          ></LineCharts>
        </b-col>
        <b-col>
          <LineCharts
            chartId="main-chart-01"
            class="chart-wrapper"
            style="height: 250px; margin-top: 20px"
            height="200"
            :chart-data="dataCollectionL"
            :options="options"
          ></LineCharts>
        </b-col>
      </b-row>
    </b-card>
    <b-card v-if="showGraphFull">
      <b-row>
        <b-col sm="7">
          <h6 id="traffic" class="card-title mb-1">
            Umidità e Pressione Atmosferica
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
            :chart-data="dataCollectionU"
            :options="options"
          ></LineCharts>
        </b-col>
        <b-col>
          <LineCharts
            chartId="main-chart-01"
            class="chart-wrapper"
            style="height: 250px; margin-top: 20px"
            height="200"
            :chart-data="dataCollectionP"
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
import ModalConfiguration from "@/components/common/ModalConfiguration";
import { setTimeout, clearTimeout, setImmediate } from "timers";
import { getStyle, hexToRgba } from "@coreui/coreui/dist/js/coreui-utilities";
import { createSingleGraphStructure } from "@/services/monitorGraph";
import { getConfiguration, getDefaultLineOptions } from "@/services/config";

import HttpManager from "@/common/services/HttpManager";
import { GET_S_STATISTICS, getServiceInfo } from "@/services/restServices";

export default {
  name: "SensorChart",
  components: {
    LineCharts,
    ModalConfiguration,
  },
  props: {
    full: {
      type: Boolean,
      default: false,
    },
  },
  data: function () {
    return {
      selected: "hour",
      intervallo: "",
      showGraph: false,
      showGraphBase: false,
      showGraphFull: false,
      tmpModalData: { disable: false, windowsOpen: true },
      model: {
        title: "Configurazione Grafici Andamento Accensione Rele",
        fields: [],
      },
      configuration: {},
      tipoDispositivo: "",
      timerId: null,
      options: {},
      dataCollectionT: {},
      dataCollectionL: {},
      dataCollectionU: {},
      dataCollectionP: {},
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
    console.log("Load configuration.." + screen.width);
    this.configuration = getConfiguration();
    if (this.full) {
      this.configuration.sensorStatistics.type = "day";
      this.configuration.sensorStatistics.full = true;
    }
    if (screen.width < 500) {
      // forzo viosualizzazione per ore
      this.configuration.sensorStatistics.type = "hour";
    }
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
            case "ID4":
              this.tmpModalData.param.full = entry.value;
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
      this.model.fields[4].value = this.tmpModalData.param.full;
      for (var ix = 0; ix < this.model.fields.length; ix++) {
        this.model.fields[ix].id = "ID" + ix;
        this.model.fields[ix].state = true;
      }
    },

    resetConfiguration() {
      console.log("reset configuration");
      this.tmpModalData.param = this.configuration.sensorStatistics;
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
        {
          label: "Sensori",
          type: "radio",
          options: [
            { text: "Luce e Temperature", value: "false" },
            { text: "Tutti", value: "true" },
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
      var interval =
        this.tmpModalData.param.type === "hour"
          ? this.tmpModalData.param.hourInterval
          : this.tmpModalData.param.dayInterval;
      let info = getServiceInfo(GET_S_STATISTICS);
      info.query.interval = interval;
      info.query.type = this.tmpModalData.param.type;
      new HttpManager()
        .callNodeServer(info)
        .then((response) => {
          var data = response.data;
          function rgbToHex(n) {
            return "#" + ((1 << 24) + n).toString(16).slice(1);
          }
          let baseColor = parseInt("24d654", 16);
          let hexColor = rgbToHex(baseColor);
          if (data.data) {
            var dati = data.data;
            let datasetL = [];
            let datasetT = [];
            let datasetU = [];
            let datasetP = [];
            //var datiServers = [];
            // create dataset empty record
            for (var i = 0; i < dati.length; i++) {
              let rele = dati[i];
              var label = [];
              let graphDatasetT = {
                label: "Temperatura  " + rele.location,
                backgroundColor: "transparent",
                borderColor: rgbToHex(baseColor + (i + 1) * 100),
                pointHoverBackgroundColor: "#fff",
                borderWidth: 2,
              };
              let graphDatasetL = {
                label: "Luce  " + rele.location,
                backgroundColor: "transparent",
                borderColor: rgbToHex(baseColor + (i + 1) * 110),
                pointHoverBackgroundColor: "#fff",
                borderWidth: 2,
              };
              let graphDatasetU = {
                label: "Umidità  " + rele.location,
                backgroundColor: "transparent",
                borderColor: rgbToHex(baseColor + (i + 1) * 120),
                pointHoverBackgroundColor: "#fff",
                borderWidth: 2,
              };
              let graphDatasetP = {
                label: "Pressione Atmosferica  " + rele.location,
                backgroundColor: "transparent",
                borderColor: rgbToHex(baseColor + (i + 1) * 130),
                pointHoverBackgroundColor: "#fff",
                borderWidth: 2,
              };
              let graphParams = {
                initialDate: new Date(rele.startTime),
                finalDate: new Date(rele.endTime),
                interval: interval,
              };
              var graph1 = createSingleGraphStructure(graphParams, true);
              var graph2 = JSON.parse(JSON.stringify(graph1));
              var graph3 = JSON.parse(JSON.stringify(graph1));
              var graph4 = JSON.parse(JSON.stringify(graph1));
              // creo label
              for (let ix = 0; ix < graph1.label.length; ix++) {
                var d = new Date(graph1.label[ix]);
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
                    if (ixGD < graph1.dati.length) {
                      graph1.dati[ixGD] = entry.temperature.toFixed(2);
                      graph2.dati[ixGD] = entry.light.toFixed(2);
                      graph3.dati[ixGD] = entry.humidity.toFixed(2);
                      graph4.dati[ixGD] = entry.pressure.toFixed(2);
                    } else console.err("Indice errato " + ixGD);
                  } catch (error) {
                    console.error(
                      "ixGD : " + ixGD + " msInterval : " + msInterval
                    );
                  }
                  // var d = new Date(new Date(currentTime) + msInterval);
                  // var datestring =
                  //   ("0" + d.getHours()).slice(-2) +
                  //   ":" +
                  //   ("0" + d.getMinutes()).slice(-2);
                  // label.push(datestring);
                }
              graphDatasetT.data = graph1.dati;
              graphDatasetL.data = graph2.dati;
              graphDatasetU.data = graph3.dati;
              graphDatasetP.data = graph4.dati;
              datasetT.push(graphDatasetT);
              datasetL.push(graphDatasetL);
              datasetU.push(graphDatasetU);
              datasetP.push(graphDatasetP);
            }
            let dataCollectionT = {
              labels: label,
              datasets: datasetT,
            };
            let dataCollectionL = {
              labels: label,
              datasets: datasetL,
            };
            let dataCollectionU = {
              labels: label,
              datasets: datasetU,
            };
            let dataCollectionP = {
              labels: label,
              datasets: datasetP,
            };
            this.dataCollectionT = dataCollectionT;
            this.dataCollectionL = dataCollectionL;
            this.dataCollectionU = dataCollectionU;
            this.dataCollectionP = dataCollectionP;
            this.options = getDefaultLineOptions();
            this.intervallo = "Gruppi di " + interval + " minuti";
            this.options.title.text = this.intervallo;
            this.showGraphBase = true;
            this.showGraphFull = this.tmpModalData.param.full;
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
