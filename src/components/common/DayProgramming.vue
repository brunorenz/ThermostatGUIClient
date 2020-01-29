<template>
  <div>
    <b-row v-for="entry in tmpData.prog" :key="entry.id">
      <b-col sm="3"> </b-col>
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
              :phrases="{ ok: 'Continua', cancel: 'Esci' }"
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
            />
          </b-col>
        </b-row>
      </b-col>
    </b-row>
  </div>
</template>
<script>
import { Datetime } from "vue-datetime";
import "vue-datetime/dist/vue-datetime.css";
import VueSlider from "vue-slider-component";
import "vue-slider-component/theme/default.css";

export default {
  name: "DayProgramming",
  components: {
    datetime: Datetime,
    slider: VueSlider
  },
  props: ["model"],
  data: function() {
    return {
      tmpData: {},
      show: false,
      dateOn: "00:00",
      dateOff: "23:50",
      idOra1: "0",
      idOra2: "1",
      maxTemp: 25,
      minTemp: 10,
      intTemp: 0.5
    };
  },
  computed: {
    intervalStateInvalidFeedback() {
      console.log("Call intervalStateInvalidFeedback");
      return "Dato immesso non valido";
    }
  },
  beforeMount: function() {
    console.log(">>>> beforeMount : Load configuration..");
    this.resetConfiguration();
  },
  beforeUpdate: function() {
    console.log(">>>> beforeUpdate Load configuration..");
    //this.resetConfiguration();
  },
  methods: {
    showModal() {
      this.resetConfiguration();
      this.show = true;
    },
    checkField(event) {
      //this._checkField(event.target.id);
    },
    updateConfiguration() {
      console.log("Update configuration");
      var fields = [];
      for (var ix = 0; ix < this.tmpModalData.model.fields.length; ix++) {
        let field = this.tmpModalData.model.fields[ix];
        if (field.value != this.model.fields[ix].value) fields.push(field);
      }
      if (fields.length > 0) this.$emit("updateConfiguration", fields);
    },
    resetConfiguration() {
      console.log("reset configuration");
      var modelOut = JSON.parse(JSON.stringify(this.model));
      for (let ix = 0; ix < modelOut.prog.length; ix++) {
        let rec = modelOut.prog[ix];
        rec.oraOn = this.getDataFromNum(rec.timeStart);
        rec.oraOff = this.getDataFromNum(rec.timeEnd);
      }
      this.tmpData = modelOut;
      //this.tmpData.disable = false;
      this.idOra1 = "O1" + modelOut.idDay;
      this.idOra2 = "O2" + modelOut.idDay;
    },
    getDataFromNum(num) {
      let h = "00" + ((num / 60) >> 0);
      let m = "00" + (num - h * 60);
      return h.substring(h.length - 2) + ":" + m.substring(m.length - 2);
    }
  }
};
</script>
