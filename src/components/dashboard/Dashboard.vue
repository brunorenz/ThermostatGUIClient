<template>
  <div class="animated fadeIn">
    <h2>Thermostats Management Console</h2>
    <b-row>
      <b-col sm="12">
        <b-card>
          <WeatherMonitor></WeatherMonitor>
        </b-card>
      </b-col>
    </b-row>
    <b-row>
      <b-col sm="6">
        <b-card>
          <SensorMonitor></SensorMonitor>
        </b-card>
      </b-col>
      <b-col sm="6">
        <b-card>
          <ReleMonitor></ReleMonitor>
        </b-card>
      </b-col>
    </b-row>
    <!--    
    <b-row>
      <b-col sm="12">
        <b-card>
          <ReleChart />
        </b-card>
      </b-col>
    </b-row>
    <b-row>
      <b-col sm="12">
        <b-card>
          <SensorChart />
        </b-card>
      </b-col>
    </b-row>
-->
    <div class="row">
      <div class="col-md-4 col-sm-4 col-xs-12">
        <div class="ourTeam-box text-center">
          <div class="col-md-12 section1">
            <router-link to="programmazione">
              <img src="img/programmazione.png" />
            </router-link>
          </div>
          <div class="section2">
            <h1>PROGRAMMAZIONE</h1>
            <br />
          </div>
          <div class="section3">
            <p>Gestisce la programmazione dei Termostati.</p>
          </div>
        </div>
      </div>
      <div class="col-md-4 col-sm-4 col-xs-12">
        <div class="section-info ourTeam-box text-center">
          <div class="col-md-12 section1">
            <router-link to="statistiche">
              <img src="img/grafici.png" />
            </router-link>
          </div>
          <div class="section2">
            <h1>STATISTICHE</h1>
            <br />
          </div>
          <div class="section3">
            <p>
              Visualizza grafici statistici relativi all'escursione termica nei
              periodi di osservazione ed all'utilizzo delle risorse
            </p>
          </div>
        </div>
      </div>
      <div class="col-md-4 col-sm-4 col-xs-12">
        <div class="section-info ourTeam-box text-center">
          <div class="col-md-12 section1">
            <router-link to="gestione">
              <img src="img/settings.png" />
            </router-link>
          </div>
          <div class="section2">
            <h1>CONFIGURAZIONE</h1>
            <br />
          </div>
          <div class="section3">
            <p>Configura i dispositivi rilevati</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment";
import SensorMonitor from "@/components/pages/SensorMonitor";
import ReleMonitor from "@/components/pages/ReleMonitor";
import ReleChart from "@/components/charts/ReleChart";
import SensorChart from "@/components/charts/SensorChart";
import WeatherMonitor from "@/components/pages/WeatherMonitor";

export default {
  name: "dashboard",
  components: {
    SensorMonitor,
    ReleMonitor,
    ReleChart,
    SensorChart,
    WeatherMonitor,
  },
  data: function() {
    return {};
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
