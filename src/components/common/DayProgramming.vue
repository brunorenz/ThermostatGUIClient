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
            :disabled="model.prog.length < 2"
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
      <b-col sm="3" v-if="programmingType === 1">
        <b-row class="text-center">
          <b-col>
            <label class="font-weight-bold">Temperatura Minima</label>
          </b-col>
        </b-row>
        <b-row  class="mt-2">
          <b-col sm="9">
            <slider
              v-model="entry.minTemp"
              :min="minTemp"
              :max="maxTemp"
              :interval="intervalTemp"
              @change="checkField"
            ></slider>
          </b-col>
          <b-col>
            <label class="font-weight-bold">{{ entry.minTemp }}</label>
          </b-col>
        </b-row>
      </b-col>
      <b-col sm="3" v-if="programmingType === 2">
        <b-row class="text-center">
          <b-col>
            <label class="font-weight-bold">Luce Minima</label>
          </b-col>
        </b-row>
        <b-row>
          <b-col sm="9" >
            <slider
              v-model="entry.minLight"
              :min="minTemp"
              :max="maxTemp"
              :interval="intervalTemp"
              @change="checkField"
            ></slider>
          </b-col>
          <b-col>
            <label class="font-weight-bold">{{ entry.minLight }}%</label>
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
            <b-form-timepicker
              :id="entry.idOraOn"
              v-model="entry.oraOn"
              @hidden="checkField"
              :hour12 = "false"
              label-no-time-selected = "Imposta ora"
              label-hours ="Ore"
              label-minutes = "Minuti"
              :minutes-step = "10"
              :hide-header="true"
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
            <b-form-timepicker
              :id="entry.idOraOff"
              v-model="entry.oraOff"
              @hidden="checkField"
              :hour12 = "false"
              label-no-time-selected = "Imposta ora"
              label-hours ="Ore"
              label-minutes = "Minuti"
              :minutes-step = "10"
              :hide-header="true"
            />
          </b-col>
        </b-row>
      </b-col>
      <b-col v-if="programmingType === 1">
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
import VueSlider from "vue-slider-component";
import "vue-slider-component/theme/default.css";
import moment from "moment";

export default {
  name: "DayProgramming",
  components: {
    slider: VueSlider,
  },
  props: ["model", "deviceList", "programmingType"],
  data: function() {
    return {
      dateOn: "00:00",
      dateOff: "23:50",
      maxTemp: 25,
      minTemp: 10,
      intervalTemp: 0.5,
      tmpSaveData: {},
    };
  },
  computed: {
  },
  beforeMount: function() {
    this.updateButton();
    this.resetConfiguration();
  },
  mounted: function() {
  },
  beforeUpdate: function() {
    this.updateButton();
  },
  methods: {
    checkField(event) {
      let change = false;
      if (this.model.prog.length != this.tmpSaveData.prog.length) change = true;
      else {
        for (let ix = 0; ix < this.model.prog.length; ix++) {          
          let rec = this.model.prog[ix];
          let recSave = this.tmpSaveData.prog[ix];
          let ts = this.getNumFromString(rec.oraOn);
          let te = this.getNumFromString(rec.oraOff);
          rec.timeStart = ts;
          rec.timeEnd = te;
          change =
            change ||
            rec.minLight != recSave.minLight ||
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
      if (this.programmingType === 1) {
        this.maxTemp = 25;
        this.minTemp = 10;
        this.intervalTemp = 0.5;
      } else {
        this.maxTemp = 100;
        this.minTemp = 0;
        this.intervalTemp = 1;
      }
    },
    getNumFromString(dt) {
      let h = parseInt(dt.substring(0,2));
      let m =  parseInt(dt.substring(3,5));
      return h * 60 + m;
    },
    getNumFromData(dt) {
      let h = dt.getHours();
      let m = dt.getMinutes();
      return h * 60 + m;
    },
    updateButton() {
      // manage delete button
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
    },
  },
};
</script>
