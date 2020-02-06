<template>
  <div class="animated fadeIn">
    <h2>Thermostats Management Console</h2>
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
      <div>
        <b-card>
            <SensorMonitor></SensorMonitor>
        </b-card>
      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment";
import SensorMonitor from "@/components/pages/SensorMonitor";

export default {
  name: "dashboard",
  components: {
    SensorMonitor
  },
  data: function() {
    return {};
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
