<template>
  <div class="animated fadeIn">
    <h2>Thermostats Management Console</h2>
    <b-row>
      <b-col sm="6">
        <b-card>
          <SensorMonitor></SensorMonitor>
        </b-card>
      </b-col>
      <b-col sm="3">
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
          <SensorChart />
        </b-card>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import moment from "moment";
import SensorMonitor from "@/components/pages/SensorMonitor";
import ReleMonitor from "@/components/pages/ReleMonitor";
import ReleChart from "@/components/charts/ReleChart";
import SensorChart from "@/components/charts/SensorChart";

export default {
  name: "Statustiche",
  components: {
    SensorMonitor,
    ReleMonitor,
    ReleChart,
    SensorChart
  }
};
</script>
