<template>
  <div>
    <b-row v-for="entry in model.prog" :key="entry.ix">
      <b-col sm="2">
        <b-row class="text-center">
          <b-button
            class="mx-1 my-1"
            variant="primary"
            @click="manageButton('addB', entry.ix)"
          >
            <b-icon icon="plus"></b-icon>
          </b-button>
          <b-button
            class="my-1"
            variant="primary"
            @click="manageButton('deleteB', entry.ix)"
          >
            <b-icon icon="trash"></b-icon>
          </b-button>
        </b-row>
        <b-row class="text-center">
          <b-button
            class="mx-1"
            variant="primary"
            :disabled="entry.up"
            @click="manageButton('upB', entry.ix)"
          >
            <b-icon icon="arrow-up"></b-icon>
          </b-button>
          <b-button
            variant="primary"
            :disabled="entry.down"
            @click="manageButton('downB', entry.ix)"
          >
            <b-icon icon="arrow-down"></b-icon>
          </b-button>
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
              :input-id="entry.idOraOn"
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
              :input-id="entry.idOraOff"
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
      <b-col>
        <b-row>
          <b-col>
            <label class="font-weight-bold">Priorità</label>
          </b-col>
        </b-row>
        <b-row>
          <b-col>
            <b-form-select
              id="selReleType"
              v-model="entry.priorityDisp"
              :options="deviceList"
              @change="checkField"
            ></b-form-select>
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
  props: ["model", "deviceList"],
  data: function() {
    return {
      dateOn: "00:00",
      dateOff: "23:50",
      maxTemp: 25,
      minTemp: 10,
      intTemp: 0.5,
      //tmpData: {},
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
    console.log(">>>> DayProgramming : beforeMount : reset configuration..");
    this.updateButton();
    this.resetConfiguration();
  },
  mounted: function() {
    console.log(">>>> DayProgramming : mounted");
  },
  beforeUpdate: function() {
    console.log(">>>> DayProgramming : beforeUpdate..");
    this.updateButton();
  },
  // updated: function() {
  //   console.log(">>>> DayProgramming : Update..");
  // },
  methods: {
    checkField(event) {
      let change = false;
      if (this.model.prog.length != this.tmpSaveData.prog.length) change = true;
      else {
        for (let ix = 0; ix < this.model.prog.length; ix++) {
          let rec = this.model.prog[ix];
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
        }
      }
      if (change) {
        console.log("Check for changes ..");
        this.$emit("updateConfiguration", this.model);
        this.tmpSaveData = JSON.parse(JSON.stringify(this.model));
      } else console.log("No changes found ..");
    },
    resetConfiguration() {
      console.log("DayProgramming : reset configuration");
      this.tmpSaveData = JSON.parse(JSON.stringify(this.model));
    },
    getNumFromData(dt) {
      let h = dt.getHours();
      let m = dt.getMinutes();
      return h * 60 + m;
    },
    updateButton() {
      for (let ix = 0; ix < this.model.prog.length; ix++) {
        let rec = this.model.prog[ix];
        rec.up = ix === 0;
        rec.down = ix === this.model.prog.length - 1;
      }
    },
    manageButton(action, ix) {
      console.log("Button : " + action);
      console.log("Button : " + ix);
      let out = [];
      if (action === "addB" || action === "deleteB") {
        // add
        for (let i = 0; i < this.model.prog.length; i++) {
          if (i === ix) {
            if (action === "addB") {
              out.push(this.model.prog[i]);
              out.push(JSON.parse(JSON.stringify(this.model.prog[i])));
            }
          } else out.push(this.model.prog[i]);
        }
        this.model.prog = out;
      } else if (action === "upB" || action === "downB") {
        let iy = ix + (action === "upB" ? -1 : 1);
        let s = this.model.prog[ix];
        this.model.prog[ix] = this.model.prog[iy];
        this.model.prog[iy] = s;
      }
      // rebuild index
      for (let i = 0; i < this.model.prog.length; i++)
        this.model.prog[i].ix = i;
      this.checkField();
    }
  }
};
</script>
