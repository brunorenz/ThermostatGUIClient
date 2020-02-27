<template>
  <div>
    <b-row v-for="entry in tmpData.prog" :key="entry.id">
      <b-col sm="2">
        <b-row class="text-center">
          <b-button class="mx-1 my-1" variant="primary"
            ><b-icon icon="plus"></b-icon
          ></b-button>
          <b-button class="my-1" variant="primary"
            ><b-icon icon="trash"></b-icon
          ></b-button>
        </b-row>
        <b-row class="text-center">
          <b-button class="mx-1" variant="primary"
            ><b-icon icon="arrow-up"></b-icon
          ></b-button>
          <b-button variant="primary"
            ><b-icon icon="arrow-down"></b-icon
          ></b-button>
        </b-row>
      </b-col>
      <b-col sm="3">
        <b-row class="text-center">
          <b-col>
            <label class="font-weight-bold">Temperatura Minima</label>
          </b-col>
        </b-row>
        <b-row>
          <b-col sm="9">
            <slider
              v-model="entry.minTemp"
              :min="minTemp"
              :max="maxTemp"
              :interval="intTemp"
              @change="checkField"
            ></slider>
          </b-col>
          <b-col>
            <label class="font-weight-bold">{{ entry.minTemp }}</label>
          </b-col>
        </b-row>
      </b-col>

      <b-col sm="2" class="text-center">
        <b-row>
          <b-col>
            <label class="font-weight-bold">Ora Accensione</label>
          </b-col>
        </b-row>
        <b-row>
          <b-col>
            <datetime
              :input-id="idOra1"
              input-style="width: 60px;text-align:center;"
              v-model="entry.oraOn"
              type="time"
              :minute-step="10"
              :hour-step="1"
              title="Imposta Ora Accensione"
              zone="Europe/Rome"
              :phrases="{ ok: 'Continua', cancel: 'Esci' }"
              @close="checkField"
            />
          </b-col>
        </b-row>
      </b-col>
      <b-col sm="2" class="text-center">
        <b-row>
          <b-col>
            <label class="font-weight-bold">Ora Spegnimento</label>
          </b-col>
        </b-row>
        <b-row>
          <b-col>
            <datetime
              :input-id="idOra2"
              input-style="width: 60px;text-align:center;"
              v-model="entry.oraOff"
              type="time"
              :minute-step="10"
              :hour-step="1"
              title="Imposta Ora Spegnimento"
              :min-datetime="dateOn"
              :phrases="{ ok: 'Continua', cancel: 'Esci' }"
              zone="Europe/Rome"
              @close="checkField"
            />
          </b-col>
        </b-row>
      </b-col>
    </b-row>
  </div>
</template>
<script>
import { Datetime, DatetimeTimePicker } from "vue-datetime";
import "vue-datetime/dist/vue-datetime.css";
import VueSlider from "vue-slider-component";
import "vue-slider-component/theme/default.css";
import moment from "moment";
//import { BIcon } from "bootstrap-vue";

export default {
  name: "DayProgramming",
  components: {
    datetime: Datetime,
    picker: DatetimeTimePicker,
    slider: VueSlider
  },
  props: ["model"],
  data: function() {
    return {
      dateOn: "00:00",
      dateOff: "23:50",
      idOra1: "0",
      idOra2: "1",
      maxTemp: 25,
      minTemp: 10,
      intTemp: 0.5,
      tmpData: {},
      tmpSaveData: {}
    };
  },
  computed: {
    intervalStateInvalidFeedback() {
      console.log("Call intervalStateInvalidFeedback");
      return "Dato immesso non valido";
    }
  },
  beforeMount: function() {
    console.log(">>>> DayProgramming : beforeMount ");
    //this.resetConfiguration();
  },
  mounted: function() {
    console.log(">>>> DayProgramming : mounted : Load configuration..");
    this.resetConfiguration();
  },
  beforeUpdate: function() {
    console.log(">>>> DayProgramming : beforeUpdate..");
  },
  methods: {
    checkField(event) {
      let change = false;
      for (let ix = 0; ix < this.tmpData.prog.length; ix++) {
        let rec = this.tmpData.prog[ix];
        let recSave = this.tmpSaveData.prog[ix];
        let ts = this.getNumFromData(new Date(rec.oraOn));
        let te = this.getNumFromData(new Date(rec.oraOff));
        rec.timeStart = ts;
        rec.timeEnd = te;
        change =
          change ||
          rec.minTemp != recSave.minTemp ||
          rec.timeStart != recSave.timeStart ||
          rec.timeEnd != recSave.timeEnd ||
          rec.priorityDisp != recSave.priorityDisp;
        //console.log("Start : " + ts + " - End : " + te);
      }
      //console.log("Current : " + JSON.stringify(this.tmpData));
      //console.log("Last    : " + this.tmpSaveData);
      if (change) {
        console.log("Check for changes ..");
        this.$emit("updateConfiguration", this.tmpData);
        this.tmpSaveData = JSON.parse(JSON.stringify(this.tmpData));
      } else console.log("No changes found ..");
    },
    resetConfiguration() {
      console.log("DayProgramming : reset configuration");
      var modelOut = JSON.parse(JSON.stringify(this.model));
      for (let ix = 0; ix < modelOut.prog.length; ix++) {
        let rec = modelOut.prog[ix];
        rec.oraOn = this.getDataFromNum(rec.timeStart);
        rec.oraOff = this.getDataFromNum(rec.timeEnd);
        rec.ix = ix;
        console.log("Record : " + JSON.stringify(rec));
      }
      this.tmpData = modelOut;
      this.tmpSaveData = JSON.parse(JSON.stringify(this.tmpData));
      this.idOra1 = "O1" + modelOut.idDay;
      this.idOra2 = "O2" + modelOut.idDay;
    },
    getNumFromData(dt) {
      let h = dt.getHours();
      let m = dt.getMinutes();
      return h * 60 + m;
    },
    getDataFromNum(num) {
      let h = "00" + ((num / 60) >> 0);
      let m = "00" + (num - h * 60);
      let now = new Date();
      now.setHours(h);
      now.setMinutes(m);
      now.setSeconds(0);
      now.setMilliseconds(0);
      now.getHours;
      return moment(now).format();
      //return h.substring(h.length - 2) + ":" + m.substring(m.length - 2);
    }
  }
};
</script>
