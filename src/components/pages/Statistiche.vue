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
          <SensorChart full="true" />
        </b-card>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import WeatherMonitor from "@/components/pages/WeatherMonitor";
import SensorMonitor from "@/components/pages/SensorMonitor";
import ReleMonitor from "@/components/pages/ReleMonitor";
import ReleChart from "@/components/charts/ReleChart";
import SensorChart from "@/components/charts/SensorChart";

export default {
  name: "Statistics",
  components: {
    SensorMonitor,
    ReleMonitor,
    ReleChart,
    SensorChart,
    WeatherMonitor
  }
};
</script>
