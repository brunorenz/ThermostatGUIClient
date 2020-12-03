<template>
  <div v-if="tmpModalData.windowsOpen">
    <h5 class="card-title mb-1">Temperatura Esterna</h5>
    <b-row>
      <b-col class="text-left" sm="2">
        <h1>
          <strong>{{ dati.name }}</strong>
        </h1>
      </b-col>
      <b-col sm="1">
        <img style="width: 48px" src="img/temperature.png" />
      </b-col>
      <b-col sm="2">
        <h1>
          <strong> {{ dati.main.temp }}° </strong>
        </h1>
      </b-col>
      <b-col sm="1">
        <img
          style="width: 48px"
          :src="'img/openweather/' + dati.weather[0].icon + '@2x.png'"
        />
      </b-col>
      <b-col class="text-center d-none d-sm-none d-md-block">
        <h1>
          <strong> {{ dati.weather[0].description }}</strong>
        </h1>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import LocalHttpManager from "@/services/LocalHttpManager";
import { setTimeout, clearTimeout, setImmediate } from "timers";
import { getConfiguration } from "@/services/config";

export default {
  name: "WeatherMonitor",
  data: function () {
    return {
      timerId: null,
      tmpModalData: {
        windowsOpen: false,
      },
      dati: {},
    };
  },
  created: function () {
    let name = `${this.$options.name}`;
    console.log("Create component " + name + " .. TIMER : " + this.timerId);
  },
  beforeDestroy: function () {
    let name = `${this.$options.name}`;
    console.log("Destroy component " + name + " .. ");
    clearTimeout(this.timerId);
    this.timerId = null;
  },
  beforeMount: function () {
    console.log("Load configuration..");
    this.configuration = getConfiguration();
    this.resetConfiguration();
  },
  mounted: function () {
    this.getWeatherData();
  },
  methods: {
    resetConfiguration() {
      console.log("reset configuration");
      this.tmpModalData.timeout = this.configuration.weatherMonitor.timeout;
    },
    restartTimer() {
      console.log("Clear Timer ID = " + this.timerId);
      clearTimeout(this.timerId);
      console.log("Start immediate getReleData");
      setImmediate(this.getWeatherData());
    },
    getWeatherData() {
      const httpService = new LocalHttpManager();
      try {
        httpService
          .getWeatherInfo()
          .then((response) => {
            this.dati = response.data;
            this.tmpModalData.windowsOpen = true;
            this.timerId = setTimeout(
              this.getWeatherData,
              this.tmpModalData.timeout
            );
          })
          .catch((error) => {});
      } catch (error) {
        console.log("Error calling getWeatherData : " + error);
      }
    },
  },
};
</script>
