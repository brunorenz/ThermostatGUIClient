<template>
  <div class="animated fadeIn">
    <b-row>
      <b-col sm="6">
        <b-card></b-card>
      </b-col>
      <b-col sm="6">
        <b-card></b-card>
      </b-col>
    </b-row>
    <b-row>
      <b-col sm="12">
        <b-card></b-card>
      </b-col>
    </b-row>
  </div>
</template>




<script>
import moment from "moment";
import HttpMonitor from "@/services/httpMonitorRest";
import ModalConfiguration from "@/components/common/ModalConfiguration";

export default {
  name: "Setup",
  components: {},
  data: function() {
    return {};
  },
  computed: {},
  methods: {}
};
</script>